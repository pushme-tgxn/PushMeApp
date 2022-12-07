import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import CustomNavigationBar from "../components/CustomNavigationBar";

const Stack = createStackNavigator();

const AuthView = () => {
    return (
        <Stack.Navigator
            initialRouteName="LoginScreen"
            detachInactiveScreens={true}
            screenOptions={{
                header: CustomNavigationBar,
            }}
        >
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />

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
