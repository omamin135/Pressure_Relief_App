import { View, Text, StyleSheet } from "react-native";
import Chip from "../Chip";

interface AngleDisplayRowProps {
  label: string;
  angle: number;
  connected: boolean;
}

const AngleDisplayRow = ({ label, angle, connected }: AngleDisplayRowProps) => {
  return (
    <View style={styles.rowContainer}>
      <View>
        <Text style={{ fontFamily: "Ariel" }}>{label}</Text>
      </View>

      <View style={styles.angleColumn}>
        <Text>{angle.toFixed(0)}°</Text>
      </View>

      <View>
        <Chip
          label={connected ? "Connected" : "Lost Connection"}
          error={!connected}
        ></Chip>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    position: "relative",
    height: 50,
  },
  angleColumn: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -40 }],
  },
});

export default AngleDisplayRow;
