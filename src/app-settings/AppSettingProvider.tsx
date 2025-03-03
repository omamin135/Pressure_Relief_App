import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface AppSettingsType {
  notificationsEnabled: boolean;
  reliefDurationSeconds: number;
  reliefIntervalMin: number;
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
