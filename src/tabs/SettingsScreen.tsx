import { View, Text, Switch, Button } from "react-native";
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
import { useAppSettings } from "../app-settings/AppSettingProvider";

const SettingsScreen = () => {
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

  // update the appSettings context to changes
  useEffect(() => {
    setSettings({
      notificationsEnabled: notificationsEnabled,
      reliefDurationSeconds: reliefDurationSeconds,
      reliefIntervalMin: reliefIntervalMin,
    });
  }, [notificationsEnabled, reliefDurationSeconds, reliefIntervalMin]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings Screen</Text>

      <View>
        <View>
          <Text>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
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
