import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useBLE } from "../bluetooth/BLEProvider";
import Chip from "../components/Chip";
import Card from "../components/Card";
import StyledButton from "../components/StyledButton";
import useColors from "../theme/useColors";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PageHeader from "../components/PageHeader";

const BluetoothScreen = () => {
  const colors = useColors();
  const {
    connectedDevice,
    isScanning,
    sensorData,
    device,
    connected,
    connectToDevice,
    disconnectFromDevice,
  } = useBLE();

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.pageContainer}>
            <PageHeader headerText="Bluetooth Connection" />
            <Card>
              <View style={styles.headerCardContainer}>
                <Text
                  style={{
                    ...styles.headerCardText,
                    color: colors.text.primary,
                  }}
                >
                  {connected
                    ? `Connected to: ${connectedDevice?.name}`
                    : "Device Disconnected"}
                </Text>
                <View>
                  {connected ? (
                    <Chip label="Device Connected" />
                  ) : (
                    <Chip label="Device Disconnected" error />
                  )}
                </View>
              </View>
            </Card>

            {isScanning ? (
              <View style={styles.scanningContainer}>
                <Text
                  style={{ ...styles.scanningText, color: colors.text.primary }}
                >
                  Scanning . . .
                </Text>
                <StyledButton
                  title="Restart Scan"
                  onPress={() => connectToDevice()}
                  color={colors.secondary.main}
                ></StyledButton>
              </View>
            ) : device != null ? (
              <Card>
                <View style={styles.deviceContainer}>
                  <View style={styles.leftColumn}>
                    <Text
                      style={{
                        ...styles.deviceHeader,
                        color: colors.text.primary,
                      }}
                    >
                      {device.name}
                    </Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <StyledButton
                      title={connected ? "Disconnect" : "Connect"}
                      onPress={() =>
                        connected ? disconnectFromDevice() : connectToDevice()
                      }
                      color={colors.secondary.main}
                    ></StyledButton>
                  </View>
                </View>
              </Card>
            ) : connected ? (
              <Card>
                <View style={styles.deviceContainer}>
                  <View style={styles.leftColumn}>
                    <Text
                      style={{
                        ...styles.deviceHeader,
                        color: colors.text.primary,
                      }}
                    >
                      {connectedDevice?.name}
                    </Text>
                    <Text
                      style={{
                        ...styles.deviceConnectedText,
                        color: connected
                          ? colors.success.primary
                          : colors.text.primary,
                      }}
                    >
                      {connected ? "Connected" : ""}
                    </Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <StyledButton
                      title={!connected ? "Disconnect" : "Connect"}
                      onPress={() =>
                        connected ? disconnectFromDevice() : connectToDevice()
                      }
                      color={colors.secondary.main}
                    ></StyledButton>
                  </View>
                </View>
              </Card>
            ) : (
              <></>
            )}

            {/* <Text>Bluetooth Screen</Text>
      <Text>{connectedDevice ? connectedDevice.name : "No Device"}</Text>
      <Text>{connected ? "connected" : "disconnected"}</Text> */}
            {/* <Text>{sensorData ? sensorData[0] : "no data"}</Text>
      <Text>{sensorData ? sensorData[1] : "no data"}</Text>
      <Text>{sensorData ? sensorData[2] : "no data"}</Text>
      <Text>{sensorData ? sensorData[3] : "no data"}</Text>
      <Text>{sensorData ? sensorData[4] : "no data"}</Text>
      <Text>{sensorData ? sensorData[5] : "no data"}</Text> */}
            {/* <Button
        title={connected ? "disconnect" : "connect"}
        onPress={() => (connected ? disconnectFromDevice() : connectToDevice())}
      ></Button> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    paddingBottom: 20,
  },
  headerCardText: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerCardContainer: {
    gap: 10,
  },
  scanningContainer: {
    gap: 10,
  },
  scanningText: {
    fontSize: 20,
    fontWeight: "600",
  },
  deviceContainer: {
    flexDirection: "row",
  },
  deviceHeader: {
    fontSize: 17,
    fontWeight: "600",
  },
  leftColumn: {
    flex: 55,
  },
  rightColumn: {
    flex: 45,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  deviceConnectedText: {
    fontWeight: "600",
  },
});

export default BluetoothScreen;
