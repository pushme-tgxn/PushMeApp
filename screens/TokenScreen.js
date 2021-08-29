import React, { useState, useEffect, useContext, useCallback } from "react";

import { SafeAreaView, FlatList, Text, useColorScheme } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import { Separator, CustomButton } from "../components/Shared";

import ViewToken from "../components/ViewToken";

import { AppReducer } from "../const";

import apiService from "../service/backend";

import styles from "../styles";

const Stack = createStackNavigator();

const TokenScreen = () => {
  return (
    <Stack.Navigator initialRouteName="TokenList">
      <Stack.Screen
        name="TokenList"
        component={TokenList}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="TokenView" component={ViewToken} />
    </Stack.Navigator>
  );
};

const TokenList = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const themedStyles = styles(colorScheme);

  const { state } = useContext(AppReducer);

  const [tokenList, setTokenList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    async function prepare() {
      setRefreshing(true);
      setTokenList([]);
      try {
        const response = await apiService.getTokenList();

        setTokenList(response);
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
              : tokenList.length == 0
              ? "No Tokens!"
              : "Active Tokens"}
          </Text>
        )}
        data={tokenList}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          let buttonStyle = themedStyles.listItem;
          if (item.token == state.expoPushToken) {
            buttonStyle = [themedStyles.listItem, { backgroundColor: "red" }];
          }
          return (
            <CustomButton
              onPress={async () => {
                navigation.navigate("TokenView", { tokenData: item });
              }}
              style={buttonStyle}
            >
              {item.id}: {item.name ? item.name : item.createdAt}
            </CustomButton>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default TokenScreen;
