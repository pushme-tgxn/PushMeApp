import React, { useState, useEffect, useContext, useCallback } from "react";

import { SafeAreaView, FlatList, Text, useColorScheme } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import { Separator, CustomButton } from "../components/Shared";

import ViewPush from "../components/ViewPush";

import { AppReducer } from "../const";

import apiService from "../service/backend";

import styles from "../styles";

const Stack = createStackNavigator();

const PushScreen = () => {
  return (
    <Stack.Navigator initialRouteName="PushList">
      <Stack.Screen
        name="PushList"
        component={PushList}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="PushView" component={ViewPush} />
    </Stack.Navigator>
  );
};

const PushList = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const themedStyles = styles(colorScheme);

  const { state } = useContext(AppReducer);

  const [pushList, setPushList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // const [pushModalOpen, setPushModalOpen] = useState(false);

  const onRefresh = useCallback(() => {
    async function prepare() {
      setRefreshing(true);
      setPushList([]);
      try {
        const response = await apiService.getPushList();

        setPushList(response);
      } catch (error) {
        alert(error);
        console.error(error);
      } finally {
        setRefreshing(false);
      }
    }
    prepare();
  }, []);

  useEffect(onRefresh, []);

  return (
    <SafeAreaView style={themedStyles.screenContainer}>
      <FlatList
        ListHeaderComponent={() => (
          <Text style={themedStyles.headerText}>
            {refreshing
              ? "List Loading..."
              : pushList.length == 0
              ? "No History!"
              : "Push History"}
          </Text>
        )}
        data={pushList}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <CustomButton
              onPress={async () => {
                navigation.navigate("PushView", { pushData: item });
              }}
              style={themedStyles.listItem}
            >
              {item.id}: {item.name ? item.name : item.token}
            </CustomButton>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default PushScreen;
