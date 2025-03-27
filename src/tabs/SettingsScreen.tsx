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

  // update the appSettings context to changes
  useEffect(() => {
    setSettings({
      notificationsEnabled: notificationsEnabled,
      reliefDurationSeconds: reliefDurationSeconds,
      reliefIntervalMin: reliefIntervalMin,
      onTimeToleranceSec: onTimeToleranceSec,
      goalNumberDailyRoutines: goalNumberDailyRoutines,
      tiltThreshold: tiltTheshold,
    });
  }, [
    notificationsEnabled,
    reliefDurationSeconds,
    reliefIntervalMin,
    onTimeToleranceSec,
    goalNumberDailyRoutines,
    tiltTheshold,
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
                  assessabilityHint="Enable or disable notifications"
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

            {/* <View>
        <View>
          
      <SleepTimePicker></SleepTimePicker>
      <View>
            <Text>Sleep Mode</Text>
            <MultiSlider
              values={[3, 5]}
              isMarkersSeparated={true}
            ></MultiSlider>
          </View>

      <View>
            <Text>Relief Duration</Text>
            <Text>{reliefDurationSeconds}</Text>
            <MultiSlider
              min={MIN_PRESSURE_RELIEF_DURATION_SEC}
              max={MAX_PRESSURE_RELIEF_DURATION_SEC}
              step={PRESSURE_RELIEF_DURATION_STEP}
              values={[reliefDurationSeconds]}
              onValuesChange={(value) => setReliefDurationSeconds(value[0])}
              snapped
              allowOverlap
            ></MultiSlider>
          </View>
          <View>
            <Text>Rest Duration</Text>
            <Text>{reliefIntervalMin}</Text>
            <MultiSlider
              min={MIN_PRESSURE_RELIEF_INTERVAL_MIN}
              max={MAX_PRESSURE_RELIEF_INTERVAL_MIN}
              step={PRESSURE_RELIEF_INTERVAL_STEP}
              values={[reliefIntervalMin]}
              onValuesChange={(value) => setReliefIntervalMin(value[0])}
              snapped
              allowOverlap
            ></MultiSlider>
          </View>
      </View>
      </View> */}
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
});

export default SettingsScreen;
