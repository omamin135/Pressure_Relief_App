import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BLEProvider } from "../bluetooth/BLEProvider";
import IonIcon from "react-native-vector-icons/Ionicons";
import SettingsScreen from "../tabs/SettingsScreen";
import HomeScreen from "../tabs/HomeScreen";
import BluetoothScreen from "../tabs/BluetoothScreen";
import { AppSettingProvider } from "../app-settings/AppSettingProvider";
import { PressureReliefStatesProvider } from "../state/PressureReliefStatesProvider";
import useColors from "../theme/useColors";
import { StyleSheet, Text } from "react-native";

const Tab = createBottomTabNavigator();

const App = () => {
  const colors = useColors();

  return (
    <AppSettingProvider>
      <BLEProvider>
        <PressureReliefStatesProvider>
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
                headerTitle: (props) => (
                  // rendering a custome header title instead of default title
                  // to better customize the look
                  <Text
                    numberOfLines={2}
                    style={{
                      ...styles.headerTextStyle,
                      color: colors.text.primary,
                    }}
                  >
                    {props.children}
                  </Text>
                ),
                headerStyle: {
                  ...styles.headerStyle,
                  backgroundColor: colors.background.secondary,
                },
                headerTitleAlign: "center",
              })}
              initialRouteName="Home"
            >
              <Tab.Screen
                name="Bluetooth"
                options={{
                  title: "Bluetooth Settings",
                  tabBarLabel: "Bluetooth",
                }}
                component={BluetoothScreen}
              />
              <Tab.Screen
                name="Home"
                options={{
                  title: "Pressure Relief Tracking",
                  tabBarLabel: "Home",
                }}
                component={HomeScreen}
              />
              <Tab.Screen
                name="Settings"
                options={{
                  title: "App Settings",
                  tabBarLabel: "Settings",
                }}
                component={SettingsScreen}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </PressureReliefStatesProvider>
      </BLEProvider>
    </AppSettingProvider>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    elevation: 0, // Removes header shadow on Android
    shadowOpacity: 0, // Removes header shadow on iOS
    borderBottomWidth: 0, // Removes the bottom border
    height: 90,
  },
  headerTextStyle: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "AlbertSans",
    textAlign: "center",
    flexWrap: "wrap",
  },
});

export default App;
