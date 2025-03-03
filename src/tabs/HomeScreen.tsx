import { View, Text, Button, Appearance } from "react-native";
import { useBLE } from "../bluetooth/BLEProvider";
import { useEffect, useState } from "react";
import TimerCard from "../screen-cards/TimerCard";
import { configurePushNotifications } from "../notifications/usePushNotifications";
import { schedulePushNotification } from "../notifications/scheduleNotifications";
import { useAppSettings } from "../app-settings/AppSettingProvider";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  // const {
  //   requestPermissions,
  //   scanForDevice,
  //   scanForPeripherals,
  //   allDevices,
  //   device,
  //   connectToDevice,
  //   connectedDevice,
  //   data,
  //   vals,
  //   startStreamingData,
  //   disconnectFromDevice,
  // } = useBLE();

  // const [connected, setConnected] = useState(false);

  // const scanAndConnectToDevice = async () => {
  //   const isPermissionsEnabled = await requestPermissions();
  //   if (isPermissionsEnabled) {
  //     console.log(scanForDevice(DEVICE_NAME));
  //   }
  // };

  // useEffect(() => {
  //   scanAndConnectToDevice();
  // }, []);

  // useEffect(() => {
  //   if (device)
  //     connectToDevice(device).then(() => {
  //       device?.isConnected().then(() => {
  //         setConnected(true);
  //       });
  //       device?.onDisconnected((error, device) => {
  //         setConnected(false);
  //       });
  //     });
  //   const intervalId = setInterval(() => {
  //     if (device) startStreamingData(device);
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [device]);

  const { connectToDevice, connectedDevice, sensorData, connected } = useBLE();

  configurePushNotifications();

  const { appSettings } = useAppSettings();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TimerCard></TimerCard>
      {/* <View>
        <Text>Home Screen</Text>
        <Text>{connectedDevice ? connectedDevice.name : "No Device"}</Text>
        <Text>{connected ? "connected" : "disconnected"}</Text>
        <Text>{sensorData}</Text>
        <Text>{appSettings.notificationsEnabled ? "true" : "false"}</Text>
        <Text>{appSettings.reliefDurationSeconds}</Text>
        <Text>{appSettings.reliefIntervalMin}</Text>
      </View>

      <Button
        title="change color"
        onPress={() => {
          Appearance.setColorScheme(
            Appearance.getColorScheme() === "light" ? "dark" : "light"
          );
          console.log(Appearance.getColorScheme());
        }}
      ></Button>
      <Button
        onPress={async () => {
          schedulePushNotification({
            title: "Reminder",
            body: "Reminder to perform pressure relief!",
          });
        }}
        title="Notify"
        color="#0a7ea4"
      ></Button> */}
    </View>
  );
};

export default HomeScreen;
