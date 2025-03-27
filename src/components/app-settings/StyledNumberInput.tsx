import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import useColors from "../../theme/useColors";

interface StyledNumberInputProps {
  title: string;
  subtitle?: string;
  value: number;
  max: number;
  min: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  onValueChange: (value: number) => void;
}

const StyledNumberInput = ({
  title,
  subtitle,
  value,
  max,
  min,
  accessibilityLabel,
  accessibilityHint,
  onValueChange,
}: StyledNumberInputProps) => {
  const colors = useColors();

  const [num, setNum] = useState<string>(value.toString());

  const submitEditing = () => {
    let n = parseInt(num);

    if (isNaN(n) || n < min) {
      setNum(min?.toString()); // Default to min if input is invalid or negative
      onValueChange(min);
      return;
    } else if (n > max) {
      setNum(max.toString()); // Cap at max
      onValueChange(max);
      return;
    }

    onValueChange(n);

    // set num again here because parseInt truncates any decimals so we need
    // to make sure it is reflected on the displayed value
    setNum(n.toString());
  };

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

      <View style={styles.inputContainer}>
        <TextInput
          value={num}
          onChangeText={setNum}
          onSubmitEditing={submitEditing}
          onEndEditing={submitEditing}
          keyboardType="numeric"
          accessibilityLabel={accessibilityLabel ? accessibilityLabel : title}
          accessibilityHint={accessibilityHint ? accessibilityHint : subtitle}
          style={{ ...styles.input }}
        />
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
  inputContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    overflow: "hidden",
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default StyledNumberInput;
