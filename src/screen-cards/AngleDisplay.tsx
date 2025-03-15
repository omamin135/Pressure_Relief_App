import { View, Text } from "react-native";
import { useBLE } from "../bluetooth/BLEProvider";

const AngleDisplay = () => {
  const { sensorData } = useBLE();

  return (
    <View>
      <View>
        <Text>Back Rest</Text>
        <Text>{sensorData ? sensorData[1] : "no data"}</Text>
        {/* <View>Status</View> */}
      </View>
      <View>
        <Text>Seat</Text>
        <Text>{sensorData ? sensorData[3] : "no data"}</Text>
      </View>
      <View>
        <Text>Leg Rest</Text>
        <Text>{sensorData ? sensorData[5] : "no data"}</Text>
      </View>
    </View>
  );
};

export default AngleDisplay;
