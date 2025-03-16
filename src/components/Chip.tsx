import { View, Text, StyleSheet } from "react-native";
import useColors from "../theme/useColors";
import IonIcon from "react-native-vector-icons/Ionicons";
// import error from "../../assets/icons/error-icon.svg";

interface ChipProps {
  label: string;
  error?: boolean;
}

const Chip = ({ label, error = false }: ChipProps) => {
  const colors = useColors();

  return (
    <View
      style={{
        ...styles.chipContainer,
        backgroundColor: error
          ? colors.error.background
          : colors.success.background,
      }}
    >
      <IonIcon
        name={error ? "alert-circle" : "checkmark"}
        size={26}
        color={error ? colors.error.primary : colors.success.primary}
      />
      <Text>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 34,
    borderRadius: 17,
    flexDirection: "row",
    gap: 7,
    padding: 5,
    paddingRight: 10,
    alignSelf: "flex-start", // Shrink to fit content width
  },
});

export default Chip;
