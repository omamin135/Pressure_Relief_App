import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import useColors from "../../theme/useColors";
import StyledSwitch from "../StyledSwitch";

interface StyledTogglerProps {
  title: string;
  subtitle?: string;
  value: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  onToggle: (value: boolean) => void;
}

const StyledToggler = ({
  title,
  subtitle,
  value,
  accessibilityLabel,
  accessibilityHint,
  onToggle,
}: StyledTogglerProps) => {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text
          style={{ ...styles.title, color: colors.text.primary }}
          accessibilityLabel={title}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ ...styles.subtitle, color: colors.text.supporting }}>
            {subtitle}
          </Text>
        ) : (
          <></>
        )}
      </View>

      <StyledSwitch
        value={value}
        onToggle={onToggle}
        color={colors.secondary.main}
        accessibilityLabel={accessibilityLabel ? accessibilityLabel : title}
        assessibilityHint={accessibilityHint ? accessibilityHint : subtitle}
      ></StyledSwitch>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
    marginBottom: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  titleContainer: {
    marginBottom: 5,
    flex: 7,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 14,
  },
});

export default StyledToggler;
