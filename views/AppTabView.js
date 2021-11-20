import React, { useState, useEffect, useContext, useCallback } from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import { FontAwesome5 } from "@expo/vector-icons";

import PushScreen from "../screens/PushScreen";
import TopicScreen from "../screens/TopicScreen";
import ConfigScreen from "../screens/ConfigScreen";

const Tab = createMaterialBottomTabNavigator();

const AppTabView = () => {
    return (
        <Tab.Navigator
            // barStyle={{ backgroundColor: "#222222" }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Push History") {
                        iconName = "history";
                    } else if (route.name === "Topics") {
                        iconName = "key";
                    } else if (route.name === "Settings") {
                        iconName = "user-cog";
                    }

                    return <FontAwesome5 name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#a845ff",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen name="Topics" component={TopicScreen} />
            <Tab.Screen name="Push History" component={PushScreen} />
            <Tab.Screen name="Settings" component={ConfigScreen} />
        </Tab.Navigator>
    );
};

export default AppTabView;
