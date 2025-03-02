/* eslint-disable no-bitwise */
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
//import AsyncStorage from "@react-native-async-storage/async-storage";

import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";
import {
  ANGLE_UUID,
  DEVICE_NAME,
  SERVICE_UUID,
  STATUS_UUID,
} from "../constants/bleConstants";
//import toUint8Array from "urlb64touint8array";
import { Buffer } from "buffer";

interface BLEContextType {
  connectedDevice: Device | undefined | null;
  sensorData: number[] | null;
  connected: boolean;
  connectToDevice: () => void;
  disconnectFromDevice: () => void;
}

type BLEProviderProps = React.PropsWithChildren<{}>;

const BLEContext = createContext<BLEContextType>({
  connectedDevice: null,
  sensorData: null,
  connected: false,
  connectToDevice: function (): void {
    throw new Error("Function not implemented.");
  },
  disconnectFromDevice: (): void => {
    throw new Error("Function not implemented.");
  },
});

const BLEProvider = ({ children }: BLEProviderProps) => {
  const bleManager = useMemo(() => new BleManager(), []);

  const [device, setDevice] = useState<Device | null>(null);
  const [sensorData, setSensorData] = useState<number[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [retryIntervalId, setRetryIntervalId] = useState<NodeJS.Timeout>();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

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
        }, 1000)
      );
    } else {
      // if not connected to device, attempt to reconnect
      clearInterval(retryIntervalId);
      setRetryIntervalId(
        setInterval(() => {
          console.log("retry");
          connectToDevice();
        }, 10000)
      );
    }
    return () => {
      clearInterval(intervalId);
      clearInterval(retryIntervalId);
    };
  }, [connectedDevice, connected]);

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
    bleManager.stopDeviceScan();
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan error " + error);
        bleManager.stopDeviceScan();
        //Handle error *******************************************************************************
      }
      if (device && device.name?.includes(deviceName)) {
        console.log(device.name);
        setDevice(device);
        bleManager.stopDeviceScan();

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
      /************************************************************************************************ */
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

      characteristics.forEach(
        (x) => {
          if (x.uuid === ANGLE_UUID) {
            x.read().then((c) => {
              if (!c.value) {
                console.log("Empty Value");
                return;
              }

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

              console.log("Decoded Floats:", floats);

              setSensorData(floats);
            });
          }
        }

        //onAngleChange(x.read())
        //x.monitor((c, e) => onAngleChange(c, e))
      );
    });
  };

  const bytes2Float = (byteArray: number[]): number => {
    // bytes in little-endian format
    const littleEndianBytes = new Uint8Array(byteArray);

    // Use DataView to interpret bytes as a float
    const view = new DataView(littleEndianBytes.buffer);

    // Assuming 32-bit float
    return view.getFloat32(0, true);
  };

  return (
    <BLEContext.Provider
      value={{
        connectedDevice,
        sensorData,
        connected,
        connectToDevice,
        disconnectFromDevice,
      }}
    >
      {children}
    </BLEContext.Provider>
  );
};

const useBLE = () => {
  return useContext(BLEContext);
};

export { BLEProvider, useBLE };
