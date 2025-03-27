import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import useColors from "../../theme/useColors";

interface OptionsType {
  label: string;
  value: number;
}

interface StyledPickerProps {
  title: string;
  subtitle?: string;
  options: OptionsType[];
  value: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  onValueChange: (value: number) => void;
}

const StyledPicker = ({
  title,
  subtitle,
  options,
  value,
  accessibilityLabel,
  accessibilityHint,
  onValueChange,
}: StyledPickerProps) => {
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

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onValueChange(itemValue)}
          mode="dropdown"
          accessibilityRole="combobox"
          accessibilityLabel={accessibilityLabel ? accessibilityLabel : title}
          accessibilityHint={accessibilityHint ? accessibilityHint : subtitle}
          style={styles.picker}
        >
          {options.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
    marginBottom: 7,
  },
  titleContainer: {
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default StyledPicker;
