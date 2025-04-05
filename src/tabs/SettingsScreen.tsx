import {
  View,
  Text,
  Switch,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useAppSettings } from "../app-settings/AppSettingProvider";
import StyledPicker from "../components/app-settings/StyledPicker";
import SleepTimePicker from "../components/app-settings/SleepTimePicker";
import Card from "../components/Card";
import useColors from "../theme/useColors";
import StyledSwitch from "../components/StyledSwitch";
import { SafeAreaProvider } from "react-native-safe-area-context";
import StyledNumberInput from "../components/app-settings/StyledNumberInput";
import PageHeader from "../components/PageHeader";
import StyledToggler from "../components/app-settings/StyledToggler";
import SegmentedControl from "../components/SegmentedControl";
import StyledSegmentContrtoller from "../components/app-settings/StyledSegmentedControl";

const reliefDurationSecOptions = [
  { label: "DEBUG 15 seconds", value: 15 },
  { label: "2 minutes", value: 120 },
  { label: "2.5 minutes", value: 150 },
  { label: "3 minutes", value: 180 },
  { label: "3.5 minutes", value: 210 },
  { label: "4 minutes", value: 240 },
  { label: "4.5 minutes", value: 270 },
  { label: "5 minutes", value: 300 },
];

const reliefIntervalMinOptions = [
  { label: "DEBUG 15 Seconds", value: 0.25 },
  { label: "15 minutes", value: 15 },
  { label: "20 minutes", value: 20 },
  { label: "25 minutes", value: 25 },
  { label: "30 minutes", value: 30 },
  { label: "35 minutes", value: 35 },
  { label: "40 minutes", value: 40 },
  { label: "45 minutes", value: 45 },
  { label: "50 minutes", value: 50 },
  { label: "55 minutes", value: 55 },
  { label: "60 minutes", value: 60 },
];

const onTimeToleranceOptions = [
  { label: "0.5 minutes", value: 30 },
  { label: "1 minutes", value: 60 },
  { label: "1.5 minutes", value: 90 },
  { label: "2 minutes", value: 120 },
  { label: "2.5 minutes", value: 150 },
  { label: "3 minutes", value: 180 },
  { label: "3.5 minutes", value: 210 },
  { label: "4 minutes", value: 240 },
  { label: "4.5 minutes", value: 270 },
  { label: "5 minutes", value: 300 },
];

const tiltThesholdOptions = [
  { label: "20°", value: 20 },
  { label: "25°", value: 25 },
  { label: "30°", value: 30 },
  { label: "30°", value: 30 },
  { label: "35°", value: 35 },
  { label: "40°", value: 40 },
  { label: "45°", value: 45 },
  { label: "50°", value: 50 },
  { label: "55°", value: 55 },
  { label: "60°", value: 60 },
];

const sensorAxisOptions = [
  { label: "x-axis", value: 0 },
  { label: "y-axis", value: 1 },
  // { label: "z-axis", value: 2 },
];

// Notifications
// durations
// upright
// sleep
// detection tolerance

//TODO: tilit theshold

const SettingsScreen = () => {
  const colors = useColors();
  const { appSettings, setSettings } = useAppSettings();

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    appSettings.notificationsEnabled
  );
  const [reliefDurationSeconds, setReliefDurationSeconds] = useState<number>(
    appSettings.reliefDurationSeconds
  );
  const [reliefIntervalMin, setReliefIntervalMin] = useState<number>(
    appSettings.reliefIntervalMin
  );
  const [onTimeToleranceSec, setOnTimeToleranceSec] = useState<number>(
    appSettings.onTimeToleranceSec
  );
  const [goalNumberDailyRoutines, setGoalNumberDailyRoutines] =
    useState<number>(appSettings.goalNumberDailyRoutines);

  const [tiltTheshold, setTiltTheshold] = useState<number>(
    appSettings.tiltThreshold
  );

  const [sensorContolledState, setSensorContolledState] = useState<boolean>(
    appSettings.sensorControlledState
  );

  const [backIndex, setBackIndex] = useState<number>(appSettings.backIndex);
  const [seatIndex, setSeatIndex] = useState<number>(appSettings.seatIndex);
  const [legIndex, setLegIndex] = useState<number>(appSettings.legIndex);

  const [invertBack, setInvertBack] = useState<boolean>(appSettings.invertBack);
  const [invertSeat, setInvertSeat] = useState<boolean>(appSettings.invertBack);
  const [invertLeg, setInvertLeg] = useState<boolean>(appSettings.invertBack);

  // update the appSettings context to changes
  useEffect(() => {
    setSettings({
      notificationsEnabled: notificationsEnabled,
      reliefDurationSeconds: reliefDurationSeconds,
      reliefIntervalMin: reliefIntervalMin,
      onTimeToleranceSec: onTimeToleranceSec,
      goalNumberDailyRoutines: goalNumberDailyRoutines,
      tiltThreshold: tiltTheshold,
      sensorControlledState: sensorContolledState,
      backIndex: backIndex,
      seatIndex: seatIndex,
      legIndex: legIndex,
      invertBack: invertBack,
      invertSeat: invertSeat,
      invertLeg: invertLeg,
    });
  }, [
    notificationsEnabled,
    reliefDurationSeconds,
    reliefIntervalMin,
    onTimeToleranceSec,
    goalNumberDailyRoutines,
    tiltTheshold,
    sensorContolledState,
    backIndex,
    legIndex,
    seatIndex,
    invertBack,
    invertSeat,
    invertLeg,
  ]);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              ...styles.pageContainer,
              backgroundColor: colors.background.main,
            }}
          >
            <PageHeader headerText="Settings" />
            <View
              style={{
                ...styles.sectionContainer,
                backgroundColor: colors.background.secondary,
              }}
            >
              <Text
                style={{
                  ...styles.sectionHeader,
                  color: colors.text.primary,
                }}
              >
                Interval Controls
              </Text>
              <StyledPicker
                title="Pressure Relief Duration"
                options={reliefDurationSecOptions}
                value={reliefDurationSeconds}
                onValueChange={setReliefDurationSeconds}
              ></StyledPicker>
              <StyledPicker
                title="Upright Interval"
                subtitle="Interval between pressure relief routines"
                options={reliefIntervalMinOptions}
                value={reliefIntervalMin}
                onValueChange={setReliefIntervalMin}
              ></StyledPicker>
              <StyledPicker
                title="Tilt Theshold"
                subtitle="How far back to tilt for pressure relief"
                options={tiltThesholdOptions}
                value={tiltTheshold}
                onValueChange={setTiltTheshold}
              ></StyledPicker>
            </View>

            <View
              style={{
                ...styles.sectionContainer,
                backgroundColor: colors.background.secondary,
              }}
            >
              <View style={{ ...styles.notificationsContainer }}>
                <Text
                  style={{
                    ...styles.notificationLabel,
                    color: colors.text.primary,
                  }}
                >
                  Enable Notifications
                </Text>
                <StyledSwitch
                  value={notificationsEnabled}
                  onToggle={setNotificationsEnabled}
                  color={colors.secondary.main}
                  accessibilityLabel="Toggle Notifications"
                  assessibilityHint="Enable or disable notifications"
                ></StyledSwitch>
              </View>
            </View>

            <View
              style={{
                ...styles.sectionContainer,
                backgroundColor: colors.background.secondary,
              }}
            >
              <Text
                style={{
                  ...styles.sectionHeader,
                  color: colors.text.primary,
                }}
              >
                Rings Settings
              </Text>
              <StyledPicker
                title="Pressure Relief Detection Tolerance"
                subtitle='Used in rings tracker as acceptable time tolerance for completing pressure relief "on time"'
                options={onTimeToleranceOptions}
                value={onTimeToleranceSec}
                onValueChange={setOnTimeToleranceSec}
              ></StyledPicker>
              <StyledNumberInput
                title="Daily Target Pressure Relief"
                subtitle="The target number of pressure relief routines to complete in a day"
                value={goalNumberDailyRoutines}
                min={1}
                max={99}
                onValueChange={setGoalNumberDailyRoutines}
              ></StyledNumberInput>
            </View>

            <View
              style={{
                ...styles.sectionContainer,
                backgroundColor: colors.background.secondary,
              }}
            >
              <Text
                style={{
                  ...styles.sectionHeader,
                  color: colors.text.primary,
                }}
              >
                Sensor Controls
              </Text>
              <StyledToggler
                title="Sensor Controlled State"
                subtitle="Sensors automatically change stetae between upright and pressure relief"
                value={sensorContolledState}
                onToggle={setSensorContolledState}
                accessibilityLabel="Sensor Controlled State"
                accessibilityHint="Sensors automatically change stetae between upright and pressure relief"
              ></StyledToggler>
              <View
                style={{ ...styles.divider, borderColor: colors.text.primary }}
              ></View>
              <View style={styles.axisContainer}>
                <StyledSegmentContrtoller
                  title="Back Axis"
                  subtitle="Rotational axis for the back sensor"
                  value={appSettings.backIndex}
                  options={sensorAxisOptions}
                  onValueChange={setBackIndex}
                ></StyledSegmentContrtoller>
                <View style={styles.axisToggleContainer}>
                  <Text
                    style={{
                      ...styles.axisInvertText,
                      color: colors.text.primary,
                    }}
                  >
                    Invert Angle
                  </Text>
                  <StyledSwitch
                    value={invertBack}
                    onToggle={setInvertBack}
                    color={colors.secondary.main}
                  ></StyledSwitch>
                </View>
              </View>
              <View style={styles.axisContainer}>
                <StyledSegmentContrtoller
                  title="Seat Axis"
                  subtitle="Rotational axis for the seat sensor"
                  value={appSettings.seatIndex}
                  options={sensorAxisOptions}
                  onValueChange={setSeatIndex}
                ></StyledSegmentContrtoller>
                <View style={styles.axisToggleContainer}>
                  <Text
                    style={{
                      ...styles.axisInvertText,
                      color: colors.text.primary,
                    }}
                  >
                    Invert Angle
                  </Text>
                  <StyledSwitch
                    value={invertSeat}
                    onToggle={setInvertSeat}
                    color={colors.secondary.main}
                  ></StyledSwitch>
                </View>
              </View>
              <View style={styles.axisContainer}>
                <StyledSegmentContrtoller
                  title="Leg Axis"
                  subtitle="Rotational axis for the leg sensor"
                  value={appSettings.legIndex}
                  options={sensorAxisOptions}
                  onValueChange={setLegIndex}
                ></StyledSegmentContrtoller>
                <View style={styles.axisToggleContainer}>
                  <Text
                    style={{
                      ...styles.axisInvertText,
                      color: colors.text.primary,
                    }}
                  >
                    Invert Angle
                  </Text>
                  <StyledSwitch
                    value={invertLeg}
                    onToggle={setInvertLeg}
                    color={colors.secondary.main}
                  ></StyledSwitch>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    gap: 20,
  },
  sectionContainer: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  notificationsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: 4,
  },
  axisContainer: {
    flexDirection: "row",
    gap: 10,
  },
  axisInvertText: {
    fontWeight: "500",
  },
  axisToggleContainer: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
});

export default SettingsScreen;
