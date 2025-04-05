import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import useColors from "../../theme/useColors";
import SegmentedControl from "../SegmentedControl";

interface OptionsType {
  label: string;
  value: number;
}

interface StyledSegmentContrtollerProps {
  title: string;
  subtitle?: string;
  options: OptionsType[];
  value: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  onValueChange: (value: number) => void;
}

const StyledSegmentContrtoller = ({
  title,
  subtitle,
  options,
  value,
  accessibilityLabel,
  accessibilityHint,
  onValueChange,
}: StyledSegmentContrtollerProps) => {
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

      <View style={styles.segmentContainer}>
        <SegmentedControl
          segments={options}
          selectedValue={value}
          onChange={onValueChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
  },
  titleContainer: {},
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 14,
  },
  segmentContainer: {
    borderRadius: 4,
    overflow: "hidden",
  },
});

export default StyledSegmentContrtoller;
