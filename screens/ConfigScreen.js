import React, { useState, useContext } from "react";

import {
  SafeAreaView,
  TextInput,
  Text,
  ScrollView,
  useColorScheme,
} from "react-native";

import * as Notifications from "expo-notifications";

import AsyncStorage from "@react-native-async-storage/async-storage";

import apiService from "../service/backend";

import { AppReducer } from "../const";
import { setUserData } from "../reducers/app";

import { Separator, CustomButton } from "../components/Shared";

import styles from "../styles";

const ConfigScreen = () => {
  const colorScheme = useColorScheme();
  const themedStyles = styles(colorScheme);

  const { state, dispatch } = useContext(AppReducer);

  return (
    <SafeAreaView style={themedStyles.screenContainer}>
      <ScrollView>
        <Text style={themedStyles.headerText}>Account</Text>

        <Text style={themedStyles.baseText}>
          Username: {state.user.username}
        </Text>
        <Text style={themedStyles.baseText}>
          Registered: {state.user.createdAt}
        </Text>
        <Text style={themedStyles.baseText}>Email: {state.user.email}</Text>

        <CustomButton
          onPress={async () => {
            await AsyncStorage.removeItem("userData");
            dispatch(setUserData(null));

            // navigation.replace("Auth");
          }}
          title="Logout"
          style={{ backgroundColor: "red" }}
        />
        <Separator />

        <Text style={themedStyles.headerText}>Device</Text>

        <Text style={themedStyles.baseText}>
          Token:
          {state.expoPushToken ? state.expoPushToken : "Loading..."}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfigScreen;
