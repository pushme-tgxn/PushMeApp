import React, { useState, useEffect } from "react";

import * as Device from "expo-device";

import {
    SafeAreaView,
    Text,
    View,
    useColorScheme,
    // TextInput,
    StyleSheet,
    FlatList,
    ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";

// import { Picker } from "@react-native-picker/picker";

import { Separator, CustomButton } from "./Shared.js";

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
        <SafeAreaView style={themedStyles.paneContainer}>
            <ScrollView>
                {/* <Text style={themedStyles.headerText}>Device</Text> */}

                <Text style={themedStyles.baseText}>ID: {deviceData.id}</Text>
                <Text style={themedStyles.baseText}>Name: {deviceData.name}</Text>
                <Text style={themedStyles.baseText}>Created: {deviceData.createdAt}</Text>
                <Separator />

                <Text style={themedStyles.headerText}>
                    {deviceData.topics.length == 0 ? "No Topics!" : "Topics"}
                </Text>

                {deviceData.topics.length !== 0 &&
                    deviceData.topics.map((item) => {
                        let buttonStyle = themedStyles.listItem;
                        return (
                            <CustomButton
                                key={item.id}
                                onPress={async () => {
                                    navigation.push("ViewTopic", {
                                        topicData: item,
                                    });
                                }}
                                style={buttonStyle}
                            >
                                {item.id} : {item.secretKey}
                            </CustomButton>
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
            </ScrollView>
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
