import React, { useState } from "react";

import { SafeAreaView, Text, View, useColorScheme, StyleSheet, FlatList, ScrollView } from "react-native";

import {
    Appbar,
    Menu,
    IconButton,
    Colors,
    Button,
    Paragraph,
    Dialog,
    Portal,
    TextInput,
} from "react-native-paper";

import { Picker } from "@react-native-picker/picker";

import apiService from "../service/api";

import { NotificationCategories } from "../const";

import styles from "../styles";

export default function PushPopup({ visible, setVisible, topicData, secretKey }) {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const [loading, setLoading] = useState(false);

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

    let clientCategoryList = [];
    // NotificationCategories;
    for (const index in NotificationCategories) {
        clientCategoryList.push({ label: index, value: index });
    }

    return (
        <React.Fragment>
            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Title>Test Push {topicData.id}</Dialog.Title>
                    <Dialog.Content>
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

                        <View style={themedStyles.pickerContainerView}>
                            <Picker
                                selectedValue={categoryId}
                                onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                            >
                                <Picker.Item key={"default"} label="Default" value="default" />
                                {clientCategoryList.map((item) => (
                                    <Picker.Item key={item.label} label={item.label} value={item.value} />
                                ))}
                            </Picker>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Cancel</Button>
                        <Button onPress={onSend} loading={loading}>
                            Send
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </React.Fragment>
    );
}
