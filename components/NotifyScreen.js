import React, { useContext } from "react";

import { SafeAreaView, View, Text, useColorScheme } from "react-native";

import { AppReducer } from "../const";

import styles from "../styles";

const AccountScreen = () => {
  const colorScheme = useColorScheme();
  const themedStyles = styles(colorScheme);

  const { state } = useContext(AppReducer);

  return (
    <SafeAreaView style={themedStyles.screenContainer}>
      <Text style={themedStyles.headerText}>Notification</Text>

      <View>
        <Text style={themedStyles.baseText}>
          ID: {state.notification && state.notification.request.identifier}
        </Text>
        <Text style={themedStyles.baseText}>
          Title:
          {state.notification && state.notification.request.content.title}
        </Text>
        <Text style={themedStyles.baseText}>
          Body: {state.notification && state.notification.request.content.body}
        </Text>
        <Text style={themedStyles.baseText}>Data:</Text>
        <Text style={themedStyles.baseText}>
          {state.notification &&
            JSON.stringify(state.notification.request.content.data)}
        </Text>
      </View>

      <View>
        <Text style={themedStyles.baseText}>response:</Text>
        <Text style={themedStyles.baseText}>
          {state.response && JSON.stringify(state.response)}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
