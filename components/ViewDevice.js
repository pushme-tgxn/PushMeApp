import React, { useState, useEffect } from "react";

import * as Device from "expo-device";

import {
    SafeAreaView,
    View,
    useColorScheme,
    // TextInput,
    StyleSheet,
    FlatList,
    ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";

import { Text, Button, FAB } from "react-native-paper";

// import { Picker } from "@react-native-picker/picker";

import { Separator } from "./Shared.js";

import { NotificationCategories } from "../const";

import apiService from "../service/api";

import styles from "../styles";

const ViewDevice = ({ navigation, route }) => {
    const { deviceData } = route.params;

    useEffect(() => {
        navigation.setOptions({
            title: `Device: ${deviceData.name}`,
        });
    }, [deviceData]);

    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const [deviceName, setDeviceName] = useState(deviceData.name || Device.deviceName);

    // const createUpdateRegistration = async () => {
    //     const fetchResponse = await apiService.device.upsertRegistration({
    //         name: deviceName,
    //         token: deviceData.token,
    //     });

    //     alert(JSON.stringify(fetchResponse));
    // };

    // const deleteRegistration = async () => {
    //     const fetchResponse = await apiService.device.deleteRegistration(deviceData.id);

    //     alert(JSON.stringify(fetchResponse));
    // };

    // const onSend = async () => {
    //     await apiService.push.pushToToken(deviceData.id, {
    //         categoryId,
    //         title,
    //         body,
    //         data,
    //     });
    // };

    let clientCategoryList = [];
    NotificationCategories;
    for (const index in NotificationCategories) {
        clientCategoryList.push({ label: index, value: index });
    }

    return (
        <SafeAreaView style={themedStyles.container.pane}>
            {/* <Text style={themedStyles.headerText}>Device</Text> */}

            <Text variant="labelLarge">ID: {deviceData.id}</Text>
            <Text variant="labelLarge">Name: {deviceData.name}</Text>
            <Text variant="labelLarge">Created: {deviceData.createdAt}</Text>

            <Separator />

            <Text variant="displaySmall" style={{ marginBottom: 10 }}>
                {deviceData.topics.length == 0 ? "No Topics!" : "Topics"}
            </Text>

            {deviceData.topics.length !== 0 &&
                deviceData.topics.map((item) => {
                    let buttonStyle = themedStyles.listItem;
                    return (
                        <Button
                            style={[themedStyles.button.bigButton, themedStyles.button.listButton]}
                            key={item.id}
                            // onPress={async () => {
                            //     navigation.push("ViewTopic", {
                            //         topicData: item,
                            //     });
                            // }}
                            mode="contained-tonal"
                        >
                            {item.id} : {item.secretKey}
                        </Button>
                    );
                })}

            {/* <View style={themedStyles.inputContainerView}>
                    <CustomButton
                        onPress={async () => {
                            await apiService.createWebhook(deviceData.id);
                        }}
                        title="Create Token!"
                        style={{ backgroundColor: "green" }}
                    />
                </View> */}
        </SafeAreaView>
    );
};

export default ViewDevice;

// const pickerSelectStyles = StyleSheet.create({
//     inputIOS: {
//         fontSize: 16,
//         paddingVertical: 0,
//         paddingHorizontal: 0,
//         borderWidth: 0,
//         flex: 1, // This flex is optional, but probably desired
//         alignItems: "center",
//         flexDirection: "row",
//         width: "100%",
//         borderColor: "gray",
//         borderRadius: 4,
//         color: "black",
//         paddingRight: 30, // to ensure the text is never behind the icon
//     },
//     icon: {
//         position: "absolute",
//         backgroundColor: "transparent",
//         borderTopWidth: 5,
//         borderTopColor: "#00000099",
//         borderRightWidth: 5,
//         borderRightColor: "transparent",
//         borderLeftWidth: 5,
//         borderLeftColor: "transparent",
//         width: 0,
//         height: 0,
//         top: 20,
//         right: 15,
//     },
//     inputAndroid: {
//         fontSize: 30,
//         paddingHorizontal: 0,
//         paddingVertical: 0,
//         borderWidth: 10,
//         borderColor: "red",
//         borderRadius: 5,

//         color: "black",
//         paddingRight: 0, // to ensure the text is never behind the icon
//     },
// });
