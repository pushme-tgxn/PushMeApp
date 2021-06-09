import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../components/LoginScreen";
import RegisterScreen from "../components/RegisterScreen";

const Stack = createStackNavigator();

const AuthView = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

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
