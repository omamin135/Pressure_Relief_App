import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const timeOptions = [
  { label: "6:00 PM", value: "18:00" },
  { label: "7:00 PM", value: "19:00" },
  { label: "8:00 PM", value: "20:00" },
  { label: "9:00 PM", value: "21:00" },
  { label: "10:00 PM", value: "22:00" },
  { label: "11:00 PM", value: "23:00" },
  { label: "12:00 AM", value: "00:00" },
  { label: "1:00 AM", value: "01:00" },
  { label: "2:00 AM", value: "02:00" },
  { label: "3:00 AM", value: "03:00" },
  { label: "4:00 AM", value: "04:00" },
  { label: "5:00 AM", value: "05:00" },
  { label: "6:00 AM", value: "06:00" },
  { label: "7:00 AM", value: "07:00" },
  { label: "8:00 AM", value: "08:00" },
  { label: "9:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "12:00 AM", value: "12:00" },
];

const SleepTimePicker = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Filter available end times based on selected start time
  const filteredEndOptions = timeOptions.filter(
    (option) => !startTime || option.value > startTime
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Sleep Time Range:</Text>

      {/* Start Time Picker */}
      <Text style={styles.pickerLabel}>Start Time:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={startTime}
          onValueChange={(value) => {
            setStartTime(value);
            if (endTime && value >= endTime) setEndTime(""); // Reset end time if invalid
          }}
          mode="dropdown"
          accessibilityLabel="Select start time"
          style={styles.picker}
        >
          <Picker.Item label="Select start time..." value="" enabled={false} />
          {timeOptions.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>

      {/* End Time Picker */}
      <Text style={styles.pickerLabel}>End Time:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={endTime}
          onValueChange={(value) => setEndTime(value)}
          mode="dropdown"
          accessibilityLabel="Select end time"
          style={styles.picker}
          enabled={startTime !== ""} // Disable until start time is selected
        >
          <Picker.Item label="Select end time..." value="" enabled={false} />
          {filteredEndOptions.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.selectedText}>
        Selected Range:{" "}
        {startTime && endTime
          ? `${timeOptions.find((t) => t.value === startTime)?.label} - ${
              timeOptions.find((t) => t.value === endTime)?.label
            }`
          : "None"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 5,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  selectedText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default SleepTimePicker;
