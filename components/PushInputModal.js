import React, { useState, useContext } from "react";

import {
  Modal,
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

const PushInputModal = ({ openTokenId, onClose }) => {
  const colorScheme = useColorScheme();
  const themedStyles = styles(colorScheme);

  const [title, setTitle] = useState("test");
  const [body, setBody] = useState("body");
  const [category, setCategory] = useState("default");
  const [data, setData] = useState({ foo: "bar" });

  const onSend = async () => {
    await apiService.pushToToken(openTokenId, {
      title,
      body,
      category,
      data,
    });

    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={openTokenId !== false}
      onRequestClose={onClose}
    >
      <View style={themedStyles.modalBackground}>
        <View style={themedStyles.pushModalWrapper}>
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
        </View>
      </View>
    </Modal>
  );
};

export default PushInputModal;

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
