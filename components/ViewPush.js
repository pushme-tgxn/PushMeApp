import React, { useEffect, useContext } from "react";

import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { AppReducer } from "../const";

import styles from "../styles";

const ViewPush = ({ navigation, route }) => {
  const { pushData } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: `View Push: ${pushData.id}`,
    });
  }, [pushData]);

  const colorScheme = useColorScheme();
  const themedStyles = styles(colorScheme);

  const { state } = useContext(AppReducer);

  return (
    <SafeAreaView style={themedStyles.paneContainer}>
      <ScrollView>
        <Text style={themedStyles.headerText}>Push Recieved</Text>

        <Text style={themedStyles.baseText}>ID: {pushData.id}</Text>
        <Text style={themedStyles.baseText}>
          Request:
          {pushData.request}
        </Text>
        <Text style={themedStyles.baseText}>
          Data:
          {pushData.pushPayload && JSON.stringify(pushData.pushPayload)}
        </Text>

        <Text style={themedStyles.headerText}>Push Response</Text>

        <Text style={themedStyles.baseText}>
          Response: {pushData.response && JSON.stringify(pushData.response)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewPush;
