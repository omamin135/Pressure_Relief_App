import { Text, View, StyleSheet } from "react-native";
import { useBLE } from "../bluetooth/BLEProvider";
import { usePressureReliefStates } from "../state/PressureReliefStatesProvider";
import Card from "../components/Card";
import Chip from "../components/Chip";
import useColors from "../theme/useColors";

const StatusSummary = () => {
  const colors = useColors();
  const { sensorStatuses, displayAngles, connected } = useBLE();
  const { pressureReliefMode } = usePressureReliefStates();

  //return true if any sensor is disconnected
  const anySensorDisconnected = () => {
    return Object.values(sensorStatuses).some((value) => !value);
  };

  return (
    <Card>
      <View style={styles.container}>
        <Text style={{ ...styles.tiltLabel, color: colors.text.primary }}>
          Overall Tilt: {displayAngles.seatAngle.toFixed(0)}°
        </Text>
        <Text style={{ ...styles.stateLabel, color: colors.text.primary }}>
          {pressureReliefMode
            ? "Pressure Relief Routine Started"
            : "Position Upright"}
        </Text>
        <View>
          {!connected ? (
            <Chip label="Device Disconnected" error></Chip>
          ) : anySensorDisconnected() ? (
            <Chip label="Sensor(s) Disconnected" error></Chip>
          ) : (
            <Chip label="Device and Sensors Connected"></Chip>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
  },
  tiltLabel: {
    fontSize: 25,
    fontWeight: "600",
  },
  stateLabel: {
    fontSize: 20,
  },
});

export default StatusSummary;
