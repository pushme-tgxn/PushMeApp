import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  Text,
  View,
  useColorScheme,
  TextInput,
  StyleSheet,
} from "react-native";

import { Separator, CustomButton } from "./Shared.js";

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

  const [title, setTitle] = useState("test");
  const [body, setBody] = useState("body");
  const [category, setCategory] = useState("default");

  const [data, setData] = useState({ foo: "bar" });

  const onSend = async () => {
    await apiService.pushToToken(tokenData.id, {
      title,
      body,
      category,
      data,
    });
  };

  return (
    <SafeAreaView style={themedStyles.container}>
      <Text style={themedStyles.headerText}>Token</Text>

      <View>
        <Text style={themedStyles.baseText}>ID: {tokenData.id}</Text>
        <Text style={themedStyles.baseText}>Name: {tokenData.name}</Text>
        <Text style={themedStyles.baseText}>
          Created: {tokenData.createdAt}
        </Text>
      </View>
      <Text style={themedStyles.headerText}>Push Something</Text>
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
          placeholder={{
            label: "Select a sport...",
            value: null,
            color: "#9EA0A4",
          }}
          style={pickerSelectStyles}
          items={[
            { label: "Default", value: "default" },
            { label: "testMe", value: "testMe" },
            { label: "buttonOpenApp", value: "buttonOpenApp" },
            { label: "buttonOpenLink", value: "buttonOpenLink" },
            { label: "textReplyMessage", value: "textReplyMessage" },
          ]}
        />

        <CustomButton
          onPress={onSend}
          title="Push!"
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
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
