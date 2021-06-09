import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "../components/HomeScreen";
import NotifyScreen from "../components/NotifyScreen";
import AccountScreen from "../components/AccountScreen";
import ConfigScreen from "../components/ConfigScreen";

const Tab = createBottomTabNavigator();

const AppTabView = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Settings") {
            iconName = "settings";
          } else if (route.name === "Account") {
            iconName = "person";
          } else if (route.name === "Notify") {
            iconName = "alarm";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      // tabBarOptions={{
      //   activeTintColor: "black",
      //   inactiveTintColor: "gray",
      // }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notify" component={NotifyScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
      <Tab.Screen name="Settings" component={ConfigScreen} />
    </Tab.Navigator>
  );
};

export default AppTabView;
