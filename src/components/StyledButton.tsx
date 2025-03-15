import {
  GestureResponderEvent,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";

interface StyledButtonProps {
  title: string;
  color: string;
  disabled?: boolean;
  assessabilityHint?: string;
  onPress?: (event: GestureResponderEvent) => void;
}

/*
 accessibilityRole → Defines the button as an actual button.
 accessibilityLabel → Provides a custom, descriptive label for screen readers.
 accessibilityHint → Gives extra context on what happens when pressed.
 accessibilityState → Describes button states (e.g., disabled, selected).
*/

const StyledButton = ({
  title,
  color,
  disabled = false,
  assessabilityHint,
  onPress,
}: StyledButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button" // declares this component as a button for readers
      accessibilityLabel={title} // What screen readers will read
      accessibilityHint={assessabilityHint} // additional info for readers to identify what this does
      accessibilityState={{ disabled }} // Announces "Disabled" if true
      style={{
        ...styles.button,
        backgroundColor: color,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StyledButton;
