import React, { useState, useContext } from "react";

import {
  SafeAreaView,
  TextInput,
  Text,
  View,
  useColorScheme,
} from "react-native";

import * as Device from "expo-device";

import * as Notifications from "expo-notifications";

import { Separator, CustomButton } from "./Shared.js";

import { AppReducer } from "../const";

import apiService from "../service/api";

import styles from "../styles";

const ConfigScreen = () => {
  const colorScheme = useColorScheme();
  const themedStyles = styles(colorScheme);

  const { state, dispatch } = useContext(AppReducer);
  apiService.setAccessToken(state.accessToken);

  const [deviceName, setDeviceName] = useState(
    `${state.user.username} - ${Device.modelName}`
  );

  const createUpdateRegistration = async () => {
    const fetchResponse = await apiService.upsertTokenRegistration({
      token: state.expoPushToken,
      name: deviceName,
    });

    alert(JSON.stringify(fetchResponse));
  };

  const deleteRegistration = async () => {
    const fetchResponse = await apiService.deleteTokenRegistration(
      state.expoPushToken
    );

    alert(JSON.stringify(fetchResponse));
  };

  const pushToMe = async () => {
    const fetchResponse = await apiService.pushToToken(state.expoPushToken, {
      title: "Testing Push!",
      body: "wow what a great test!",
      category: "default",
      data: { foo: "bar" },
    });

    alert(JSON.stringify(fetchResponse));
  };

  const pushDirect = async () => {
    fetch("https://exp.host/--/api/v2/push/send", {
      body: JSON.stringify({
        to: state.expoPushToken,
        title: "Test Title",
        body: "Test Body",
        data: { random: Math.random() },
        categoryId: `pushme`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  };

  const pushLocal = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: "Here is the notification body",
        data: { data: "goes here" },
        categoryId: "pushme",
      },
      trigger: { seconds: 1 },
    });
  };

  return (
    <SafeAreaView style={themedStyles.screenContainer}>
      <View>
        <Text style={themedStyles.headerText}>Configuration</Text>

        <Text style={themedStyles.baseText}>Device Token:</Text>
        <Text style={themedStyles.baseText}>
          {state.expoPushToken ? state.expoPushToken : "Loading..."}
        </Text>

        <Separator />
        <Text style={themedStyles.baseText}>Device Name:</Text>
        <TextInput
          style={themedStyles.inputStyle}
          onChangeText={setDeviceName}
          value={deviceName}
          placeholder="Device Name"
        />

        <Separator />

        <CustomButton
          onPress={createUpdateRegistration}
          title="Register/Update for Push"
          style={{ backgroundColor: "green" }}
        />

        <CustomButton
          onPress={deleteRegistration}
          title="Unregister for Push"
          style={{ backgroundColor: "red" }}
        />

        <CustomButton
          onPress={pushToMe}
          title="Push Me"
          style={{ backgroundColor: "blue" }}
        />

        <CustomButton
          onPress={pushDirect}
          title="Push Me (Direct)"
          style={{ backgroundColor: "blue" }}
        />

        <CustomButton
          onPress={pushLocal}
          title="Push Me (Local)"
          style={{ backgroundColor: "blue" }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ConfigScreen;
