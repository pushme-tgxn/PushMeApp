import React, { useState, useEffect, useContext, useCallback } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FontAwesome5 } from "@expo/vector-icons";

import PushScreen from "../screens/PushScreen";
import TokenScreen from "../screens/TokenScreen";
import ConfigScreen from "../screens/ConfigScreen";

const Tab = createBottomTabNavigator();

const AppTabView = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Push History") {
            iconName = "history";
          } else if (route.name === "My Tokens") {
            iconName = "key";
          } else if (route.name === "Settings") {
            iconName = "user-cog";
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Push History" component={PushScreen} />
      <Tab.Screen name="My Tokens" component={TokenScreen} />
      <Tab.Screen name="Settings" component={ConfigScreen} />
    </Tab.Navigator>
  );
};

export default AppTabView;
