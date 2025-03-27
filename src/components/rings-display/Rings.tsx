import { View, StyleSheet, Text } from "react-native";
import CircularProgress from "../CircularProgress";
import useColors from "../../theme/useColors";

interface RingsProps {
  ringProgress: number[];
  displayLabel?: string;
}

const Rings = ({ ringProgress, displayLabel }: RingsProps) => {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {/* Largest Circle */}
      <View style={[styles.progressWrapper]}>
        <CircularProgress
          progress={ringProgress[0]}
          size={220}
          strokeWidth={12}
          color={colors.primary.main}
          backgroundColor={colors.background.secondary}
        />
      </View>

      {/* Medium Circle */}
      <View style={[styles.progressWrapper]}>
        <CircularProgress
          progress={ringProgress[1]}
          size={196}
          strokeWidth={12}
          color={colors.secondary.main}
          backgroundColor={colors.background.secondary}
        />
      </View>
      <Text style={{ ...styles.displayLabel, color: colors.text.primary }}>
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  progressWrapper: {
    position: "absolute", // Stacks all the circles on top of each other
  },
  displayLabel: {
    fontSize: 20,
    textAlign: "center",
    width: 150,
    fontWeight: "bold",
  },
});

export default Rings;
