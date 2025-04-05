import React, { useState } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  AccessibilityState,
} from "react-native";
import useColors from "../theme/useColors";

interface Segment {
  label: string;
  value: number;
}

interface SegmentedControlProps {
  segments: Segment[];
  selectedValue: number;
  onChange: (value: number) => void;
}

const SegmentedControl = ({
  segments,
  selectedValue,
  onChange,
}: SegmentedControlProps) => {
  const colors = useColors();
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {segments.map((segment) => {
        const isSelected = selectedValue === segment.value;

        const accessibilityState: AccessibilityState = {
          selected: isSelected,
        };

        return (
          <Pressable
            key={segment.value}
            onPress={() => onChange(segment.value)}
            accessibilityRole="tab"
            accessibilityState={accessibilityState}
            accessibilityLabel={segment.label}
            style={{
              ...styles.button,
              backgroundColor: isSelected
                ? colors.secondary.main
                : colors.background.secondary,
            }}
          >
            <Text
              style={{
                ...styles.label,
                color: isSelected
                  ? colors.background.main
                  : colors.text.primary,
              }}
            >
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  label: {
    fontWeight: "bold",
  },
});

export default SegmentedControl;
