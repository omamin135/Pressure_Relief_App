import { View, SafeAreaView, ScrollView, Text } from "react-native";
import { useBLE } from "../bluetooth/BLEProvider";
import { useState } from "react";
import TimerCard from "../screen-cards/TimerCard";
import { configurePushNotifications } from "../notifications/usePushNotifications";
import { useAppSettings } from "../app-settings/AppSettingProvider";
import AngleDisplayCard from "../screen-cards/AngleDisplay";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useColors from "../theme/useColors";
import { StyleSheet } from "react-native";
import RingsCard from "../screen-cards/RingsCard";
import PageHeader from "../components/PageHeader";
import StatusSummary from "../components/StatusSummary";

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

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.homeContainer}>
            <PageHeader headerText="Pressure Relief Tracking" />
            <StatusSummary />
            <TimerCard />
            <AngleDisplayCard />
            <RingsCard />
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
    paddingBottom: 20,
  },
});

export default HomeScreen;
