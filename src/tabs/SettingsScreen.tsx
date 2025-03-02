import { View, Text, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {
  MAX_PRESSURE_RELIEF_DURATION_SEC,
  MAX_PRESSURE_RELIEF_INTERVAL_MIN,
  MIN_PRESSURE_RELIEF_DURATION_SEC,
  MIN_PRESSURE_RELIEF_INTERVAL_MIN,
  PRESSURE_RELIEF_DURATION_STEP,
  PRESSURE_RELIEF_INTERVAL_STEP,
} from "../constants/settingsConstants";

const defaultSettings = {
  notificationsEndabled: true,
  reliefDurationSeconds: 120,
  reliefIntervalMin: 20,
};

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    defaultSettings.notificationsEndabled
  );
  const [reliefDurationSeconds, setReliefDurationSeconds] = useState<number>(
    defaultSettings.reliefDurationSeconds
  );
  const [reliefIntervalMin, setReliefIntervalMin] = useState<number>(
    defaultSettings.reliefIntervalMin
  );

  //Load saved settings on app startup
  useEffect(() => {
    const loadSettings = async () => {
      const notifications = await AsyncStorage.getItem("notifications");
      if (notifications !== null)
        setNotificationsEnabled(JSON.parse(notifications));
    };
    loadSettings();
  }, []);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem("notifications", JSON.stringify(value));
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings Screen</Text>

      <View>
        <View>
          <Text>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
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
          <View>
            <Text>Sleep Mode</Text>
            <MultiSlider
              values={[3, 5]}
              isMarkersSeparated={true}
            ></MultiSlider>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;
