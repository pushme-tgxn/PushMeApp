import React, { useState } from "react";

import { SafeAreaView, Text, View, useColorScheme, StyleSheet, FlatList, ScrollView } from "react-native";

import {
    Appbar,
    Menu,
    IconButton,
    Colors,
    Button,
    Modal,
    Dialog,
    Portal,
    TextInput,
} from "react-native-paper";

// import { Picker } from "@react-native-picker/picker";

// import { PaperSelect } from "react-native-paper-select";

import DropDown from "react-native-paper-dropdown";

import { useTheme } from "react-native-paper";
import apiService from "../service/api";

import { NotificationCategories } from "../const";

import styles from "../styles";

export default function PushPopup({ visible, setVisible, topicData, secretKey }) {
    const theme = useTheme();
    const colorScheme = useColorScheme();

    const themedStyles = styles(colorScheme);

    const [loading, setLoading] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false);

    const [categoryId, setCategory] = useState("default");
    const [title, setTitle] = useState("Test notification title!");
    const [body, setBody] = useState("Test body.");
    const [data, setData] = useState({});

    const onSend = async () => {
        setLoading(true);
        await apiService.push.pushToTopic(secretKey, {
            categoryId,
            title,
            body,
            data,
        });
        // setLoading(false);
        setVisible(false);
    };

    let clientCategoryList = [{ value: "default", label: "Default" }];
    // NotificationCategories;
    for (const index in NotificationCategories) {
        clientCategoryList.push({ value: index, label: index });
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
