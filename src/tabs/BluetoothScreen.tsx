import { View, Text, Button } from "react-native";
import { useBLE } from "../bluetooth/BLEProvider";

const BluetoothScreen = () => {
  const {
    connectedDevice,
    sensorData,
    connected,
    connectToDevice,
    disconnectFromDevice,
  } = useBLE();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bluetooth Screen</Text>
      <Text>{connectedDevice ? connectedDevice.name : "No Device"}</Text>
      <Text>{connected ? "connected" : "disconnected"}</Text>
      <Text>{sensorData ? sensorData[0] : "no data"}</Text>
      <Text>{sensorData ? sensorData[1] : "no data"}</Text>
      <Text>{sensorData ? sensorData[2] : "no data"}</Text>
      <Text>{sensorData ? sensorData[3] : "no data"}</Text>
      <Text>{sensorData ? sensorData[4] : "no data"}</Text>
      <Text>{sensorData ? sensorData[5] : "no data"}</Text>
      <Button
        title={connected ? "disconnect" : "connect"}
        onPress={() => (connected ? disconnectFromDevice() : connectToDevice())}
      ></Button>
    </View>
  );
};

export default BluetoothScreen;
