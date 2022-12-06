import React, { useState, useEffect, useContext, useCallback } from "react";
import * as Clipboard from "expo-clipboard";

import Toast from "react-native-root-toast";

import { SafeAreaView, FlatList, Text, ScrollView, useColorScheme, View } from "react-native";
import { Button, List, TextInput } from "react-native-paper";

import { Checkbox, IconButton, Colors } from "react-native-paper";

import { AppReducer } from "../const";

import apiService from "../service/api";

import PushPopup from "./PushPopup";

import styles from "../styles";

const ViewTopic = ({ navigation, route }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state } = useContext(AppReducer);

    const [deviceList, setDeviceList] = useState([]);
    const [checkedDeviceList, setCheckedDeviceList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    let { topicData } = route.params;

    useEffect(() => {
        // set navigation title
        navigation.setOptions({
            title: `View Topic: ${topicData.id}`,
        });

        // fetch devices, init list
        onRefresh();
    }, [topicData]);

    const onRefresh = useCallback(() => {
        async function prepare() {
            setRefreshing(true);
            setDeviceList([]);

            try {
                const freshData = await apiService.topic.getTopic(topicData.id);
                topicData = freshData.topic;
                console.log("refreshed topicData", topicData.id);

                const topicDeviceArray = topicData.devices.map((device) => device.id);

                const response = await apiService.device.getList();

                setDeviceList(response.devices);

                const checkedDeviceArray = response.devices.map((device) => {
                    return topicDeviceArray.indexOf(device.id) !== -1;
                });

                setCheckedDeviceList(checkedDeviceArray);
            } catch (error) {
                alert(error);
                console.error(error);
            } finally {
                setRefreshing(false);
            }
        }
        prepare();
    }, []);

    const updateTopicDevices = async (topicId, deviceIds) => {
        try {
            await apiService.topic.update(topicId, {
                deviceIds,
            });
        } catch (error) {
            alert(error);
        }
    };

    const onChangeChecked = async (index) => {
        checkedDeviceList[index] = !checkedDeviceList[index];
        setCheckedDeviceList(checkedDeviceList);

        const deviceIdList = checkedDeviceList
            .map((checked, chkIndex) => {
                if (checked) {
                    return deviceList[chkIndex].id;
                }
                return null;
            })
            .filter(Boolean);

        // console.log("onChangeChecked deviceIdList", deviceIdList);
        await updateTopicDevices(topicData.id, deviceIdList);
        onRefresh();
    };

    const [visible, setVisible] = useState(false);
    return (
        <SafeAreaView style={themedStyles.paneContainer}>
            <FlatList
                ListHeaderComponent={() => (
                    <View style={{ paddingTop: 10 }}>
                        <Text style={themedStyles.baseText}>Name: {topicData.name || "Unnamed Topic"}</Text>

                        <Text style={themedStyles.baseText}>ID: {topicData.id}</Text>
                        <Text style={themedStyles.baseText}>Key: {topicData.topicKey}</Text>
                        <Text style={themedStyles.baseText}>Secret: {topicData.secretKey}</Text>
                        <View style={{ flexDirection: "row", alignContent: "center" }}>
                            <Button
                                onPress={async () => {
                                    setVisible(true);
                                }}
                                icon="check"
                                mode="contained"
                                color="purple"
                                style={{ flex: 1, margin: 10 }}
                            >
                                Test Push
                            </Button>
                        </View>
                        <View style={{ flexDirection: "row", alignContent: "center" }}>
                            <PushPopup
                                topicData={topicData}
                                secretKey={topicData.secretKey}
                                visible={visible}
                                setVisible={setVisible}
                            />
                            <Button
                                onPress={async () => {
                                    await Clipboard.setStringAsync(topicData.topicKey);
                                    Toast.show("✅ Copied topic key to clipboard. 🎉", {
                                        duration: Toast.durations.SHORT,
                                        position: -65,
                                        backgroundColor: "#222222",
                                        animation: true,
                                    });
                                }}
                                icon="copy"
                                mode="outline"
                                color="green"
                                style={{ flex: 1, margin: 10 }}
                            >
                                Copy Key
                            </Button>
                            <Button
                                onPress={async () => {
                                    await Clipboard.setStringAsync(topicData.secretKey);
                                    Toast.show("✅ Copied topic secret to clipboard. 🤫", {
                                        duration: Toast.durations.SHORT,
                                        position: -65,
                                        backgroundColor: "#222222",
                                        animation: true,
                                    });
                                }}
                                icon="copy"
                                mode="outline"
                                color="orange"
                                style={{ flex: 1, margin: 10 }}
                            >
                                Copy Secret
                            </Button>
                        </View>
                        <Text style={themedStyles.headerText}>
                            {refreshing
                                ? "Devices Loading..."
                                : state.topicList.length == 0
                                ? "No Devices!"
                                : "Devices"}
                        </Text>
                    </View>
                )}
                data={deviceList}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderItem={({ item, index }) => (
                    <List.Item
                        title={<Text style={themedStyles.baseText}>Name: {item.name}</Text>}
                        description={<Text style={themedStyles.baseText}>ID: {item.id}</Text>}
                        left={() => (
                            <Checkbox
                                status={checkedDeviceList[index] ? "checked" : "unchecked"}
                                onPress={() => {
                                    onChangeChecked(index);
                                }}
                            />
                        )}
                    >
                        test
                    </List.Item>
                )}
            />
        </SafeAreaView>
    );
};

export default ViewTopic;
