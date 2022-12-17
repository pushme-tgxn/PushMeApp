import React, { useState, useEffect } from "react";

import { SafeAreaView, View, useColorScheme } from "react-native";

import { Text, Button, FAB } from "react-native-paper";

import { Separator } from "./Shared.js";

import apiService from "../service/api";

import styles from "../styles";

const ViewDevice = ({ navigation, route }) => {
    const { deviceData } = route.params;

    console.log("ViewDevice", deviceData);

    useEffect(() => {
        navigation.setOptions({
            title: `Device: ${deviceData.name}`,
        });
    }, [deviceData]);

    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    return (
        <SafeAreaView style={themedStyles.container.pane}>
            {/* <Text style={themedStyles.headerText}>Device</Text> */}

            <Text variant="labelLarge">ID: {deviceData.id}</Text>
            <Text variant="labelLarge">Device Ident: {deviceData.deviceKey}</Text>
            <Text variant="labelLarge">Name: {deviceData.name}</Text>
            <Text variant="labelLarge">Created: {deviceData.createdAt}</Text>

            <View style={{ flexDirection: "row", alignContent: "center" }}>
                <Button
                    onPress={async () => {
                        apiService.device.testDevice(deviceData.deviceKey);
                    }}
                    icon="check"
                    mode="contained"
                    color="purple"
                    style={{ flex: 1, marginVertical: 10 }}
                >
                    Test FCM Push
                </Button>
            </View>

            <Separator />

            <Text variant="labelLarge">Token: {deviceData.token ? deviceData.token : "Not Set"}</Text>

            {deviceData.nativeToken && (
                <Text variant="labelLarge">
                    Native Token:{" "}
                    {deviceData.nativeToken
                        ? `${JSON.parse(deviceData.nativeToken).type} ${JSON.parse(
                              deviceData.nativeToken,
                          ).data.substring(1, 20)}...`
                        : "Not Set"}
                </Text>
            )}

            <Separator />

            <Text variant="displaySmall" style={{ marginBottom: 10 }}>
                {deviceData.topics.length == 0 ? "No Topics!" : "Topics"}
            </Text>

            {deviceData.topics.length !== 0 &&
                deviceData.topics.map((item) => {
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
        </SafeAreaView>
    );
};

export default ViewDevice;
