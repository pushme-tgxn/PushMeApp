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
            sceneAnimationEnabled={true}
            sceneAnimationType={"shifting"}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "History") {
                        iconName = "history";
                    } else if (route.name === "Topics") {
                        iconName = "book";
                    } else if (route.name === "Settings") {
                        iconName = "user-cog";
                    }

                    return <FontAwesome5 name={iconName} size={20} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Topics" component={TopicScreen} />
            <Tab.Screen name="History" component={PushScreen} />
            <Tab.Screen name="Settings" component={ConfigScreen} />
        </Tab.Navigator>
    );
};

export default AppTabView;
