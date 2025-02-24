import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BLEProvider } from "../bluetooth/BLEProvider";
import IonIcon from "react-native-vector-icons/Ionicons";
import SettingsScreen from "../tabs/SettingsScreen";
import HomeScreen from "../tabs/HomeScreen";
import BluetoothScreen from "../tabs/BluetoothScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <BLEProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName =
                route.name === "Home" ? "home-outline" : "settings-outline";
              return <IonIcon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
            animationEnabled: false,
          })}
          initialRouteName="Home"
        >
          <Tab.Screen name="Bluetooth" component={BluetoothScreen} />
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </BLEProvider>
  );
}
