import React, { useEffect } from "react";

import { SafeAreaView, Text, View, useColorScheme } from "react-native";

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

  return (
    <SafeAreaView style={themedStyles.screenContainer}>
      <Text style={themedStyles.headerText}>Push Recieved</Text>

      <View>
        <Text style={themedStyles.baseText}>ID: {pushData.id}</Text>
        <Text style={themedStyles.baseText}>
          Data:
          {pushData.pushPayload}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ViewPush;
