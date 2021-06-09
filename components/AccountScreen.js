import React, { useContext } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScrollView, SafeAreaView, Text, useColorScheme } from "react-native";

import { Separator, CustomButton } from "./Shared.js";

import { AppReducer } from "../const";
import { setUserData } from "../reducers/app";

import styles from "../styles";

const AccountScreen = ({ navigation }) => {
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

        <Separator />

        <CustomButton
          onPress={async () => {
            await AsyncStorage.removeItem("userData");
            dispatch(setUserData(null));

            // navigation.replace("Auth");
          }}
          title="Logout"
          style={{ backgroundColor: "red" }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;
