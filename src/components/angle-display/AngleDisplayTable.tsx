import { View, StyleSheet } from "react-native";
import { displayAnglesType, sensorStatusType } from "../../bluetooth/dataTypes";
import AngleDisplayRow from "./AngleDisplayRow";
import useColors from "../../theme/useColors";

interface AngleDisplayTableProps {
  displayAngles: displayAnglesType;
  sensorStatuses: sensorStatusType;
  deviceConnected: boolean;
}

const AngleDisplayTable = ({
  displayAngles,
  sensorStatuses,
  deviceConnected,
}: AngleDisplayTableProps) => {
  const colors = useColors();

  return (
    <View style={styles.tableContainer}>
      <AngleDisplayRow
        label="Back Rest"
        angle={displayAngles.backSeatAngle}
        connected={sensorStatuses.backSensor && deviceConnected}
      ></AngleDisplayRow>
      <View
        style={{ ...styles.divider, borderColor: colors.text.primary }}
      ></View>
      <AngleDisplayRow
        label="Seat"
        angle={displayAngles.seatAngle}
        connected={sensorStatuses.seatSensor && deviceConnected}
      ></AngleDisplayRow>
      <View
        style={{ ...styles.divider, borderColor: colors.text.primary }}
      ></View>
      <AngleDisplayRow
        label="Leg Rest"
        angle={displayAngles.legSeatAngle}
        connected={sensorStatuses.legSensor && deviceConnected}
      ></AngleDisplayRow>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    // marginTop: -20,
    marginBottom: -10,
  },
  divider: {
    borderBottomWidth: 1,
  },
});

export default AngleDisplayTable;
