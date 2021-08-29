import React, { useState, useEffect, useContext, useCallback } from "react";

import { SafeAreaView, FlatList, Text, useColorScheme } from "react-native";

import { Separator, CustomButton } from "../components/Shared";

import PushInputModal from "../components/PushInputModal";

import { AppReducer } from "../const";

import apiService from "../service/backend";

import styles from "../styles";

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const themedStyles = styles(colorScheme);

  const { state } = useContext(AppReducer);
  apiService.setAccessToken(state.accessToken);

  const [tokenList, setTokenList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [pushModalOpen, setPushModalOpen] = useState(false);

  const onRefresh = useCallback(() => {
    async function prepare() {
      setRefreshing(true);
      setTokenList([]);
      try {
        const response = await apiService.getTokenList();

        setTokenList(response);
      } catch (erroor) {
        console.error(error);
      }

      setRefreshing(false);
    }
    prepare();
  }, []);

  useEffect(onRefresh, []);

  return (
    <SafeAreaView style={themedStyles.screenContainer}>
      <PushInputModal
        openTokenId={pushModalOpen}
        onClose={() => setPushModalOpen(false)}
      />
      <FlatList
        ListHeaderComponent={() => (
          <Text style={themedStyles.headerText}>
            {refreshing
              ? "List Loading..."
              : tokenList.length == 0
              ? "No Registrations!"
              : "Active Registrations"}
          </Text>
        )}
        ListFooterComponent={() =>
          !refreshing &&
          tokenList.length > 0 && (
            <CustomButton
              onPress={async () => {
                await apiService.pushToAll({
                  title: "Push all button clicked@!",
                  body: "wow what a great testiN!",
                  category: "buttonOpenLink",
                  data: { foo: "bar" },
                });
              }}
              style={[themedStyles.listItem, { backgroundColor: "orange" }]}
            >
              All Devices
            </CustomButton>
          )
        }
        data={tokenList}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          if (item.token == state.expoPushToken)
            return (
              <CustomButton
                onPress={async () => {
                  setPushModalOpen(item.token);

                  //   await apiService.pushToToken(item.token, {
                  //     title: "Push specific device clicked!!!",
                  //     body: "wow what a great test!",
                  //     category: "buttonOpenApp",
                  //     data: { foo: "bar" },
                  //   });
                }}
                style={[themedStyles.listItem, { backgroundColor: "red" }]}
              >
                {item.id}: {item.name ? item.name : item.token}
              </CustomButton>
            );
          return (
            <CustomButton
              onPress={async () => {
                setPushModalOpen(item.token);
                // await apiService.pushToToken(item.token, {
                //   title: "Push specific device clicked!!!",
                //   body: "wow what a great test!",
                //   category: "buttonOpenApp",
                //   data: { foo: "bar" },
                // });
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

export default HomeScreen;
