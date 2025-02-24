/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
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
} from "./bleConstants";
//import toUint8Array from "urlb64touint8array";
import { Buffer } from "buffer";

interface AngleData {
  back: {
    connected: boolean;
    roll: number;
    pitch: number;
  };
  seat: {
    connected: boolean;
    roll: number;
    pitch: number;
  };
  leg: {
    connected: boolean;
    roll: number;
    pitch: number;
  };
}

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void; //*********************************** */
  scanForDevice(device: string): void;
  connectToDevice: (device: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  startStreamingData: (device: Device) => void;
  connectedDevice: Device | null;
  allDevices: Device[]; //************************************* */
  device: Device | undefined;
  angleData: AngleData | undefined;
  data: string;
  vals: number[];
}

function useBLE(): BluetoothLowEnergyApi {
  //useMemo so persistent across re-renders
  const bleManager = useMemo(() => new BleManager(), []);

  // tracks all devices found from bluetooth scan
  const [allDevices, setAllDevices] = useState<Device[]>([]); //*************** */

  const [device, setDevice] = useState<Device>();

  const [vals, setVals] = useState<number[]>([]);

  // device connected to
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  const [angleData, setAngleData] = useState<AngleData>();

  const [data, setData] = useState<string>("");

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

  // Filter out duplicated devices
  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  // scan for devices
  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name?.includes(DEVICE_NAME)) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const scanForDevice = (deviceName: string) => {
    bleManager.stopDeviceScan();
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan error" + error);
        //Handle error *******************************************************************************
      }
      if (device && device.name?.includes(deviceName)) {
        setDevice(device);
      }
    });
  };

  // connect to the device
  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
      /************************************************************************************************ */
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

  const onAngleStatusChange = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const rawData = base64.decode(characteristic.value);

    setData(rawData);
    return;

    let innerHeartRate: number = -1;

    const firstBitValue: number = Number(rawData) & 0x01;

    if (firstBitValue === 0) {
      innerHeartRate = rawData[1].charCodeAt(0);
    } else {
      innerHeartRate =
        Number(rawData[1].charCodeAt(0) << 8) +
        Number(rawData[2].charCodeAt(2));
    }
  };

  const processRawData = (binData: string) => {
    const pitch = parseFloat(binData.substring(0, 7));

    return {
      back: {
        connected: false, //non-zero is true
        roll: hexToFloat(binData.substring(0, 7)),
        pitch: hexToFloat(binData.substring(8, 15)),
      },
      seat: {
        connected: false,
        roll: hexToFloat(binData.substring(16, 23)),
        pitch: hexToFloat(binData.substring(24, 31)),
      },
      leg: {
        connected: false,
        roll: hexToFloat(binData.substring(32, 39)),
        pitch: hexToFloat(binData.substring(40, 47)),
      },
    };
  };

  const bytes2Float = (byteArray: number[]): number => {
    // Split hex string into bytes (2 characters each)

    // Reverse bytes to account for little-endian format
    const littleEndianBytes = new Uint8Array(byteArray);

    // Use DataView to interpret bytes as a float
    const view = new DataView(littleEndianBytes.buffer);

    // Assuming 32-bit float
    return view.getFloat32(0, true);
  };

  const hexToFloat = (hexString: string) => {
    return 1.1;
  };

  const onAngleChange = (characteristic: Characteristic | null) => {
    // if (error) {
    //   console.log(error);
    //   setData(error.message ?? "error1");
    //   return -1;
    // } else if (!characteristic?.value) {
    //   console.log("No Data was recieved");
    //   setData("error2");
    //   return -1;
    // }
    if (!characteristic) return;

    //const rawData = base64.decode(characteristic.value ?? "empty");

    setData(characteristic.value ?? "empty");
    return;
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      // device.monitorCharacteristicForService(
      //   HEART_RATE_UUID,
      //   HEART_RATE_CHARACTERISTIC,
      //   onHeartRateUpdate
      // );

      // device.monitorCharacteristicForService(
      //   SERVICE_UUID,
      //   STATUS_UUID,
      //   onAngleStatusChange
      // );
      //await device.discoverAllServicesAndCharacteristics();
      // characteristic = await device.readCharacteristicForService(
      //   SERVICE_UUID,
      //   ANGLE_UUID
      // );
      // device.monitorCharacteristicForService(
      //   SERVICE_UUID,
      //   ANGLE_UUID,
      //   onAngleChange
      // );

      await device.discoverAllServicesAndCharacteristics();
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

                setVals(floats);
              });
            }
          }

          //onAngleChange(x.read())
          //x.monitor((c, e) => onAngleChange(c, e))
        );
      });
    } else {
      console.log("No Device Connected");
    }
  };

  return {
    scanForPeripherals,
    scanForDevice,
    requestPermissions,
    connectToDevice,
    vals,
    allDevices,
    connectedDevice,
    device,
    disconnectFromDevice,
    startStreamingData,
    angleData,
    data,
  };
}

export default useBLE;
