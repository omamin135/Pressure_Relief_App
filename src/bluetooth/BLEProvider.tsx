/* eslint-disable no-bitwise */
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef,
} from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Characteristic, Device } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";
import {
  ANGLE_DB_STORE_PERIOD_COUNT,
  ANGLE_UUID,
  BACK_DEFAULT_ANGLE,
  BACK_SENSOR_NUMBER,
  BLE_READ_PERIOD_SEC,
  BLE_RECONNECT_PERIOD_SEC,
  DEVICE_NAME,
  LEG_DEFAULT_ANGLE,
  LEG_SENSOR_NUMBER,
  NUM_IMU_AXES,
  SEAT_DEFAULT_ANGLE,
  SEAT_SENSOR_NUMBER,
  STATUS_UUID,
} from "../constants/bleConstants";
import { Buffer } from "buffer";
import { anglesType, displayAnglesType, sensorStatusType } from "./dataTypes";
import { useDatabase } from "../dataBase/DataBaseProvider";
import { useAppSettings } from "../app-settings/AppSettingProvider";
import { schedulePushNotification } from "../notifications/scheduleNotifications";

interface BLEContextType {
  connectedDevice: Device | undefined | null;
  device: Device | null;
  isScanning: boolean;
  sensorData: number[] | null;
  angles: anglesType;
  displayAngles: displayAnglesType;
  sensorStatuses: sensorStatusType;
  connected: boolean;
  connectToDevice: () => void;
  disconnectFromDevice: () => void;
}

interface BLEProviderProps {
  children?: React.ReactNode | undefined;
}

const BLEContext = createContext<BLEContextType>({
  connectedDevice: null,
  device: null,
  isScanning: false,
  sensorData: null,
  connected: false,
  angles: {
    backAngle: BACK_DEFAULT_ANGLE,
    seatAngle: SEAT_DEFAULT_ANGLE,
    legAngle: LEG_DEFAULT_ANGLE,
  },
  displayAngles: { backSeatAngle: 0, seatAngle: 0, legSeatAngle: 0 },
  sensorStatuses: { backSensor: false, seatSensor: false, legSensor: false },
  connectToDevice: (): void => {
    throw new Error("Function not implemented.");
  },
  disconnectFromDevice: (): void => {
    throw new Error("Function not implemented.");
  },
});

export const BLEProvider = ({ children }: BLEProviderProps) => {
  const bleManager = useMemo(() => new BleManager(), []);
  const { storeAngleData } = useDatabase();
  const { appSettings } = useAppSettings();

  const [device, setDevice] = useState<Device | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [sensorData, setSensorData] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [angles, setAngles] = useState<anglesType>({
    backAngle: BACK_DEFAULT_ANGLE,
    seatAngle: SEAT_DEFAULT_ANGLE,
    legAngle: LEG_DEFAULT_ANGLE,
  });
  const [displayAngles, setDisplayAngles] = useState<displayAnglesType>({
    backSeatAngle: 0,
    seatAngle: 0,
    legSeatAngle: 0,
  });
  const [sensorStatuses, setSensorStatuses] = useState<sensorStatusType>({
    backSensor: false,
    seatSensor: false,
    legSensor: false,
  });
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [retryIntervalId, setRetryIntervalId] = useState<NodeJS.Timeout>();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [notificationLock, setNotificationLock] = useState(false);

  const lock = useRef(false);
  const dbStoreCount = useRef(0);

  useEffect(() => {
    connectToDevice();
  }, []);

  useEffect(() => {
    if (connectedDevice && connected) {
      // clear first to avoid having multiple intervals spun up

      clearInterval(intervalId);
      clearInterval(retryIntervalId);
      setIntervalId(
        setInterval(() => {
          readData(connectedDevice);
        }, BLE_READ_PERIOD_SEC * 1000)
      );
    } else {
      // if not connected to device, attempt to reconnect
      clearInterval(retryIntervalId);
      setRetryIntervalId(
        setInterval(() => {
          //console.log("retry");
          connectToDevice();
        }, BLE_RECONNECT_PERIOD_SEC * 1000)
      );
    }

    return () => {
      clearInterval(intervalId);
      clearInterval(retryIntervalId);
    };
  }, [connectedDevice, connected]);

  useEffect(() => {
    console.log("Connect");
    if (!connected) {
      if (appSettings.notificationsEnabled && !lock.current) {
        //timeout notification so you dont get spammed when device rapidely connects and disconnects sometimes
        lock.current = true;
        setTimeout(() => {
          lock.current = false;
        }, 10000);

        schedulePushNotification({
          title: "Device Disconnected",
          body: "Bluetooth connection lost",
        });
      }
    }
  }, [connected]);

  useEffect(() => {
    const backAngle =
      sensorData[NUM_IMU_AXES * BACK_SENSOR_NUMBER + appSettings.backIndex];
    const seatAngle =
      sensorData[NUM_IMU_AXES * SEAT_SENSOR_NUMBER + appSettings.seatIndex];
    const legAngle =
      sensorData[NUM_IMU_AXES * LEG_SENSOR_NUMBER + appSettings.legIndex];

    setAngles({
      backAngle: !sensorStatuses.backSensor
        ? angles.backAngle
        : appSettings.invertBack
        ? -backAngle
        : backAngle,
      seatAngle: !sensorStatuses.seatSensor
        ? angles.seatAngle
        : appSettings.invertSeat
        ? -seatAngle
        : seatAngle,
      legAngle: !sensorStatuses.legSensor
        ? angles.legAngle
        : appSettings.invertLeg
        ? -legAngle
        : legAngle,
    });
  }, [sensorData]);

  useEffect(() => {
    computeDisplayAngles();

    // every Angle_DB_STORE_PERIOD angle reads store in database
    if (dbStoreCount.current > ANGLE_DB_STORE_PERIOD_COUNT) {
      storeAngleData(angles.backAngle, angles.seatAngle, angles.legAngle);
      // storeAngleData(angles.backAngle, angles.seatAngle, angles.legAngle);
      dbStoreCount.current = 0;
      return;
    }
    dbStoreCount.current++;
  }, [angles]);

  useEffect(() => {
    // dont handle notifcations if disabled
    if (!appSettings.notificationsEnabled) return;
    //dont care about sensor status if device is not connected
    if (!connected) return;

    if (
      !sensorStatuses.backSensor ||
      !sensorStatuses.seatSensor ||
      !sensorStatuses.legSensor
    ) {
      schedulePushNotification({
        title: "Sensor(s) Disconnected",
        body: "A sensor has been disconnected",
      });
    }
  }, [sensorStatuses]);

  const connectToDevice = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      //find device with DEVICE_NAME
      scanForDevice(DEVICE_NAME);
    }
  };

  // "Normal" android permissions request
  // returns true if all permisssions granted
  // returns true if on ios
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "App Requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  // android 31 and above require separate permissions scanning
  // returns true if all permissions are granted
  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Scan Permission",
        message: "App Requires Bluetooth Scanning",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Connect Permission",
        message: "App Requires Bluetooth Connecting",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Fine Location Permission",
        message: "App Requires Fine Location Access",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  // Searches for devices with deviceName as it name
  // sets device state to the found device
  const scanForDevice = (deviceName: string) => {
    setIsScanning(true);

    bleManager.stopDeviceScan();
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan error " + error);
        // bleManager.stopDeviceScan();
      }
      if (device && device.name?.includes(deviceName)) {
        console.log(device.name);
        setDevice(device);
        bleManager.stopDeviceScan();

        setIsScanning(false);
        //connect to found device
        connect(device);
      }
    });
  };

  // connect to the device
  const connect = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);

      if (await deviceConnection.isConnected()) {
        setConnectedDevice(deviceConnection);
        setConnected(true);
        await deviceConnection.discoverAllServicesAndCharacteristics();

        // event listener waiting for disconnection
        deviceConnection.onDisconnected((error, device) => {
          setConnectedDevice(null);
          setConnected(false);
        });
      }
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id).then((device) =>
        device.isConnected().then((c) => {
          if (!c) {
            setConnectedDevice(null);
            setConnected(false);
          }
        })
      );
    }
  };

  const readData = async (device: Device) => {
    const services = await device.services();

    services.forEach(async (service) => {
      const characteristics = await device.characteristicsForService(
        service.uuid
      );

      const statusCharacteristic = characteristics.find(
        (x) => x.uuid === STATUS_UUID
      );
      const angleCharacteristic = characteristics.find(
        (x) => x.uuid === ANGLE_UUID
      );

      statusCharacteristic?.read().then((c) => {
        const statuses = decodeSensorStatusData(c);

        setSensorStatuses({
          backSensor: statuses[BACK_SENSOR_NUMBER] === 1,
          seatSensor: statuses[SEAT_SENSOR_NUMBER] === 1,
          legSensor: statuses[LEG_SENSOR_NUMBER] === 1,
        });
      });

      angleCharacteristic?.read().then((c) => {
        const floats = decodeAngleData(c);

        setSensorData(floats);

        //console.log("Decoded Floats:", floats);
      });

      // characteristics.forEach(
      //   (x) => {
      //     if (x.uuid === ANGLE_UUID) {
      //       x.read().then((c) => {
      //         const floats = decodeAngleData(c);

      //         console.log("Decoded Floats:", floats);

      //         setSensorData(floats);
      //         // const rawBytes = Buffer.from(c.value, "base64");
      //         // const hexString = rawBytes.toString("hex");
      //         // const bytes = [];
      //         // for (let i = 0; i < hexString.length; i += 2) {
      //         //   bytes.push(parseInt(hexString.slice(i, i + 2), 16));
      //         // }
      //         // const floats = [];
      //         // for (let i = 0; i < bytes.length; i += 4) {
      //         //   floats.push(bytes2Float(bytes.slice(i, i + 4)));
      //         // }
      //         // console.log("Decoded Floats:", floats);
      //         // setSensorData(floats);
      //       });
      //     } else if (x.uuid === STATUS_UUID) {
      //       x.read().then((c) => {
      //         if (!c.value) {
      //           console.log("Empty Status Value");
      //           return;
      //         }

      //         //const rawData = Buffer.from(c.value, "base64");

      //         //setSensorStatuses(rawData);
      //       });
      //     }
      //   }

      //onAngleChange(x.read())
      //x.monitor((c, e) => onAngleChange(c, e))
      // );
    });
  };

  const decodeAngleData = (c: Characteristic) => {
    if (!c.value) return [0, 0, 0, 0, 0, 0];
    const rawBytes = Buffer.from(c.value, "base64");

    const hexString = rawBytes.toString("hex");

    const bytes = [];
    for (let i = 0; i < hexString.length; i += 2) {
      bytes.push(parseInt(hexString.slice(i, i + 2), 16));
    }

    const floats = [];

    for (let i = 0; i < bytes.length; i += 4) {
      floats.push(bytes2Float(bytes.slice(i, i + 4)));
    }

    return floats;
  };

  const decodeSensorStatusData = (c: Characteristic) => {
    if (!c.value) return [0, 0, 0];
    // return [1, 1, 1];

    // Convert base64 to Uint8Array
    const buffer = Buffer.from(c.value, "base64");
    const bytes = new Uint8Array(buffer);

    // Convert bytes to 0 or 1 based on their value
    const result = Array.from(bytes).map((byte) => (byte === 0 ? 0 : 1));

    return result;
  };

  const bytes2Float = (byteArray: number[]): number => {
    // bytes in little-endian format
    const littleEndianBytes = new Uint8Array(byteArray);

    // Use DataView to interpret bytes as a float
    const view = new DataView(littleEndianBytes.buffer);

    // Assuming 32-bit float
    return view.getFloat32(0, true);
  };

  // returns the angles used in the angle display
  // [backSeatAngle] the angle from the seat to the back rest
  // [seatAngle] the angle of the seat up from the horizontal
  // [legSeatAngle] the angle from the leg rest to the bottom of the seat
  const computeDisplayAngles = () => {
    console.log("seatangle " + angles.seatAngle);
    setDisplayAngles({
      backSeatAngle: 180 - angles.backAngle - angles.seatAngle,
      seatAngle: angles.seatAngle,
      legSeatAngle: 180 + angles.legAngle - angles.seatAngle,
    });
  };

  return (
    <BLEContext.Provider
      value={{
        connectedDevice,
        device,
        isScanning,
        sensorData,
        connected,
        angles,
        displayAngles,
        sensorStatuses,
        connectToDevice,
        disconnectFromDevice,
      }}
    >
      {children}
    </BLEContext.Provider>
  );
};

export const useBLE = () => {
  return useContext(BLEContext);
};
