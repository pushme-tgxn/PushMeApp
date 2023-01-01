import React, { useState, useContext } from "react";

import { SafeAreaView, Text, View, useColorScheme, StyleSheet, FlatList, ScrollView } from "react-native";

import { Button, Modal, Dialog, Portal, TextInput, useTheme } from "react-native-paper";

import DropDown from "react-native-paper-dropdown";

import { NotificationDefinitions } from "@pushme-tgxn/pushmesdk";

import { AppReducer, BACKEND_URL } from "../const";
import { dispatchSDKError, setUserData } from "../reducers/app";

import apiService from "../service/api";
import styles from "../styles";

export default function PushPopup({ visible, setVisible, topicData, secretKey }) {
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state, dispatch } = useContext(AppReducer);

    const [loading, setLoading] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false);

    const [categoryId, setCategory] = useState("default");
    const [title, setTitle] = useState("Test notification title!");
    const [body, setBody] = useState("Test body.");
    const [data, setData] = useState({});

    const onSend = async () => {
        setLoading(true);
        try {
            await apiService.push.pushToTopic(secretKey, {
                categoryId,
                title,
                body,
                data,
            });
        } catch (error) {
            dispatchSDKError(error, dispatch);
        } finally {
            // setLoading(false);
            setVisible(false);
        }
    };

    // generate list of push types
    let clientCategoryList = [{ value: "default", label: "Default" }];
    for (const index in NotificationDefinitions) {
        const notificationCategory = NotificationDefinitions[index];
        clientCategoryList.push({ value: index, label: notificationCategory.title });
    }

    console.log("clientCategoryList", clientCategoryList);

    return (
        <React.Fragment>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={{ backgroundColor: theme.colors.background, margin: 20 }}
                >
                    <Dialog.Title>Test Push {topicData.id}</Dialog.Title>
                    <Dialog.Content>
                        <View>
                            <TextInput
                                style={themedStyles.fields.inputStyle}
                                onChangeText={setTitle}
                                value={title}
                                placeholder="Title"
                            />

                            <TextInput
                                style={themedStyles.fields.inputStyle}
                                onChangeText={setBody}
                                value={body}
                                placeholder="Body"
                            />
                        </View>

                        <View style={themedStyles.dropdown.containerView}>
                            <DropDown
                                label={"Gender"}
                                mode={"outlined"}
                                visible={showDropDown}
                                showDropDown={() => setShowDropDown(true)}
                                onDismiss={() => setShowDropDown(false)}
                                value={categoryId}
                                setValue={setCategory}
                                list={clientCategoryList}
                            />
                            {/* <PaperSelect
                                theme={theme}
                                label="Select Category"
                                value={categoryId}
                                onSelection={(value) => setCategory(value.text)}
                                arrayList={[...clientCategoryList]}
                                selectedArrayList={[]}
                                // errorText={colors.error}
                                multiEnable={false}
                                textInputMode="flat"
                                // searchStyle={{ iconColor: "red" }}
                                // searchPlaceholder="Procurar"
                                // modalCloseButtonText="fechar"
                                // modalDoneButtonText="terminado"
                            /> */}

                            {/* 
                            <Picker
                                selectedValue={categoryId}
                                onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                            >
                                <Picker.Item key={"default"} label="Default" value="default" />
                                {clientCategoryList.map((item) => (
                                    <Picker.Item key={item.label} label={item.label} value={item.value} />
                                ))}
                            </Picker> */}
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Cancel</Button>
                        <Button onPress={onSend} loading={loading}>
                            Send
                        </Button>
                    </Dialog.Actions>
                </Modal>
            </Portal>
        </React.Fragment>
    );
}
