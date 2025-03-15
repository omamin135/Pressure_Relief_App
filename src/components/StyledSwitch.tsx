import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import useColors from "../theme/useColors";

interface StyledSwitchProps {
  value: boolean;
  label: string;
  color: string;
  assessabilityHint?: string;
  onToggle: (value: boolean) => Promise<void> | void;
}

/*
accessibilityRole="switch" → Identifies as a toggle switch.
accessibilityLabel → Describes the switch to screen readers.
accessibilityHint → Helps users understand what it does.
accessibilityState={{ checked: isEnabled }} → Announces on/off state.
*/

const StyledSwitch = ({
  value,
  label,
  color,
  assessabilityHint,
  onToggle,
}: StyledSwitchProps) => {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: "#767577", true: color }}
        thumbColor={value ? "#ffffff" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e" // Default background for iOS
        onValueChange={onToggle}
        value={value}
        accessibilityRole="switch" // declares this component as a switch for readers
        accessibilityLabel={label} //what the screen reader will read
        accessibilityHint={assessabilityHint} // additional info for readers to identify what this does
        accessibilityState={{ disabled: false, checked: value }}
      />
      <Text style={{ ...styles.label, color: colors.text.primary }}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StyledSwitch;
