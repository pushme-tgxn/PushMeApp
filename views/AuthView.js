import React, { useState, useEffect, useContext, useCallback } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";

import LoginScreen from "../screens/LoginScreen";
import LoginScreenNative from "../screens/LoginScreenNative";
import RegisterScreen from "../screens/RegisterScreen";

import CustomNavigationBar from "../components/CustomNavigationBar";

const Stack = createStackNavigator();

const AuthView = () => {
    useEffect(() => {
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        };
    }, []);

    const isRunningInExpoGo = Constants.appOwnership === "expo";
    return (
        <Stack.Navigator
            initialRouteName="LoginScreen"
            // detachInactiveScreens={true}
            screenOptions={{
                header: CustomNavigationBar,
            }}
        >
            {isRunningInExpoGo && (
                <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            )}
            {!isRunningInExpoGo && (
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreenNative}
                    options={{ headerShown: false }}
                />
            )}

            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{
                    title: "Register",
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthView;
