import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface AppSettingsType {
  notificationsEnabled: boolean;
  reliefDurationSeconds: number;
  reliefIntervalMin: number;
  onTimeToleranceSec: number;
  goalNumberDailyRoutines: number;
  tiltThreshold: number;
  sensorControlledState: boolean;
  backIndex: number;
  seatIndex: number;
  legIndex: number;
  invertBack: boolean;
  invertSeat: boolean;
  invertLeg: boolean;
}

interface AppSettingsContextType {
  appSettings: AppSettingsType;
  setSettings: (newSettings: AppSettingsType) => void;
}

interface AppSettingsProviderProps {
  children?: React.ReactNode | undefined;
}

const defaultAppSettings: AppSettingsType = {
  notificationsEnabled: true,
  reliefDurationSeconds: 120,
  reliefIntervalMin: 20,
  onTimeToleranceSec: 120,
  goalNumberDailyRoutines: 25,
  tiltThreshold: 45,
  sensorControlledState: true,
  backIndex: 0,
  seatIndex: 0,
  legIndex: 0,
  invertBack: false,
  invertSeat: false,
  invertLeg: false,
};

const AppSettingsContext = createContext<AppSettingsContextType>({
  appSettings: defaultAppSettings,
  setSettings: (): void => {
    throw new Error("Function not implemented.");
  },
});

export const AppSettingProvider = ({ children }: AppSettingsProviderProps) => {
  const [appSettings, setAppSettings] = useState(defaultAppSettings);

  // on mount set appSettings to value in AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("appSettings").then((data) => {
      // set settings value if data is returned
      console.log("storage: " + data);
      if (data) {
        setAppSettings(JSON.parse(data));
      }
    });
  }, []);

  const setSettings = (newSettings: AppSettingsType) => {
    console.log("merged ");
    console.log(newSettings);
    setAppSettings(newSettings);

    AsyncStorage.setItem("appSettings", JSON.stringify(newSettings));
  };

  return (
    <AppSettingsContext.Provider value={{ appSettings, setSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  return useContext(AppSettingsContext);
};
