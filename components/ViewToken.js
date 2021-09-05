import React, { useState, useEffect } from "react";

import * as Device from "expo-device";

import {
  SafeAreaView,
  Text,
  View,
  useColorScheme,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";

import { Separator, CustomButton } from "./Shared.js";

import { NotificationCategories } from "../const";

import RNPickerSelect from "react-native-picker-select";
import apiService from "../service/backend";

import styles from "../styles";

const ViewToken = ({ navigation, route }) => {
  const { tokenData } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: `View Token: ${tokenData.name}`,
    });
  }, [tokenData]);

  const colorScheme = useColorScheme();
  const themedStyles = styles(colorScheme);

  const [categoryId, setCategory] = useState("default");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [data, setData] = useState({});

  const [deviceName, setDeviceName] = useState(
    tokenData.name || Device.deviceName
  );

  const createUpdateRegistration = async () => {
    const fetchResponse = await apiService.upsertTokenRegistration({
      token: tokenData.token,
      name: deviceName,
    });

    alert(JSON.stringify(fetchResponse));
  };

  const deleteRegistration = async () => {
    const fetchResponse = await apiService.deleteTokenRegistration(
      tokenData.token
    );

    alert(JSON.stringify(fetchResponse));
  };

  const onSend = async () => {
    await apiService.pushToToken(tokenData.id, {
      categoryId,
      title,
      body,
      data,
    });
  };

  let clientCategoryList = [];
  NotificationCategories;
  for (const index in NotificationCategories) {
    clientCategoryList.push({ label: index, value: index });
  }

  return (
    <SafeAreaView style={themedStyles.paneContainer}>
      <ScrollView>
        <Text style={themedStyles.headerText}>Token</Text>

        <Text style={themedStyles.baseText}>ID: {tokenData.id}</Text>
        <Text style={themedStyles.baseText}>Name: {tokenData.name}</Text>
        <Text style={themedStyles.baseText}>
          Created: {tokenData.createdAt}
        </Text>
        <Separator />

        <Text style={themedStyles.baseText}>Device Name:</Text>
        <TextInput
          style={themedStyles.inputStyle}
          onChangeText={setDeviceName}
          value={deviceName}
          placeholder="Device Name"
        />

        <CustomButton
          onPress={createUpdateRegistration}
          title="Save name"
          style={{ backgroundColor: "green" }}
        />

        <CustomButton
          onPress={deleteRegistration}
          title="Unregister device"
          style={{ backgroundColor: "red" }}
        />
        <Separator />
        <Text style={themedStyles.headerText}>Test Push</Text>

        <View style={themedStyles.inputContainerView}>
          <TextInput
            style={themedStyles.inputStyle}
            onChangeText={setTitle}
            value={title}
            placeholder="Title"
          />
        </View>
        <View style={themedStyles.inputContainerView}>
          <TextInput
            style={themedStyles.inputStyle}
            onChangeText={setBody}
            value={body}
            placeholder="Body"
          />
        </View>

        <View style={themedStyles.inputContainerView}>
          <RNPickerSelect
            onValueChange={setCategory}
            selectedValue={{ label: categoryId, value: categoryId }}
            placeholder={{
              label: "Select a category...",
              value: "default",
            }}
            // useNativeAndroidPickerStyle={false}
            style={pickerSelectStyles}
            items={[
              { label: "Default", value: "default" },
              ...clientCategoryList,
            ]}
          >
            <Text>{categoryId}</Text>
          </RNPickerSelect>
        </View>
        <View style={themedStyles.inputContainerView}>
          <CustomButton
            onPress={onSend}
            title="Push!"
            style={{ backgroundColor: "green" }}
          />
        </View>

        <Separator />

        <FlatList
          ListHeaderComponent={() => (
            <Text style={themedStyles.headerText}>
              {tokenData.webhooks.length == 0 ? "No Webhooks!" : "Webhooks"}
            </Text>
          )}
          data={tokenData.webhooks}
          refreshing={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            let buttonStyle = themedStyles.listItem;
            return (
              <CustomButton
                // onPress={async () => {
                //   navigation.navigate("TokenView", { tokenData: item });
                // }}
                style={buttonStyle}
              >
                {item.id} : {item.secretKey}
              </CustomButton>
            );
          }}
        />
      </ScrollView>
      <View style={themedStyles.inputContainerView}>
        <CustomButton
          onPress={async () => {
            await apiService.createWebhook(tokenData.id);
          }}
          title="Create Token!"
          style={{ backgroundColor: "green" }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewToken;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 0,
    flex: 1, // This flex is optional, but probably desired
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  icon: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 5,
    borderTopColor: "#00000099",
    borderRightWidth: 5,
    borderRightColor: "transparent",
    borderLeftWidth: 5,
    borderLeftColor: "transparent",
    width: 0,
    height: 0,
    top: 20,
    right: 15,
  },
  inputAndroid: {
    fontSize: 30,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 10,
    borderColor: "red",
    borderRadius: 5,

    color: "black",
    paddingRight: 0, // to ensure the text is never behind the icon
  },
});
