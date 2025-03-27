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
import { DatabaseProvider } from "../dataBase/DataBaseProvider";

const Tab = createBottomTabNavigator();

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//TODO: add tab bar ccessability labels
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const App = () => {
  const colors = useColors();

  return (
    <AppSettingProvider>
      <DatabaseProvider>
        <BLEProvider>
          <PressureReliefStatesProvider>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    //  =
                    //   route.name === "Home"
                    //     ? "home"
                    //     : route.name === "Settings"
                    //     ? "settings"
                    //     : "bluetooth-outline";

                    if (route.name === "Home") {
                      iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Bluetooth") {
                      iconName = focused ? "bluetooth" : "bluetooth-outline";
                    } else {
                      iconName = focused ? "settings" : "settings-outline";
                    }

                    return (
                      <IonIcon name={iconName} size={size} color={color} />
                    );
                  },
                  tabBarActiveTintColor: colors.secondary.dark,
                  tabBarInactiveTintColor: colors.text.supporting,
                  animationEnabled: false,
                  headerShown: false,
                  tabBarPressColor: "transparent", // Removes ripple on Android
                  tabBarPressOpacity: 0, // Removes fade effect on iOS

                  // headerTitle: (props) => (
                  //   // rendering a custome header title instead of default title
                  //   // to better customize the look
                  //   <Text
                  //     numberOfLines={2}
                  //     style={{
                  //       ...styles.headerTextStyle,
                  //       color: colors.text.primary,
                  //     }}
                  //   >
                  //     {props.children}
                  //   </Text>
                  // ),
                  // headerStyle: {
                  //   ...styles.headerStyle,
                  //   backgroundColor: colors.background.secondary,
                  // },
                  // headerTitleAlign: "center",
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
      </DatabaseProvider>
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
