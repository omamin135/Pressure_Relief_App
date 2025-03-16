import {
  View,
  Text,
  Button,
  Appearance,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useBLE } from "../bluetooth/BLEProvider";
import { useEffect, useState } from "react";
import TimerCard from "../screen-cards/TimerCard";
import { configurePushNotifications } from "../notifications/usePushNotifications";
import { schedulePushNotification } from "../notifications/scheduleNotifications";
import { useAppSettings } from "../app-settings/AppSettingProvider";
import { useFocusEffect } from "@react-navigation/native";
import AngleDisplayCard from "../screen-cards/AngleDisplay";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CircularProgress from "../components/CircularProgress";
import useColors from "../theme/useColors";
import { StyleSheet } from "react-native";
import WheelchairAngleDiagram from "../components/angle-display/WheelchairAngleDiagram";
import Chip from "../components/Chip";

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

  const colors = useColors();

  const [leg, setAdjustedLegAngle] = useState(-90);
  const [seat, setAdjustedSeatAngle] = useState(10);
  const [back, setAdjustedBackAngle] = useState(60);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.homeContainer}>
            <TimerCard></TimerCard>
            <AngleDisplayCard></AngleDisplayCard>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
});

export default HomeScreen;
