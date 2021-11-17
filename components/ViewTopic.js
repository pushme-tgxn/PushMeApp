import React, { useState, useEffect, useContext, useCallback } from "react";

import { SafeAreaView, FlatList, Text, ScrollView, useColorScheme, View } from "react-native";
import { List, TextInput } from "react-native-paper";

import { Checkbox, IconButton, Colors } from "react-native-paper";

import { AppReducer } from "../const";

import apiService from "../service/api";

import styles from "../styles";

const ViewTopic = ({ navigation, route }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state } = useContext(AppReducer);

    let { topicData, topicIndex } = route.params;

    const [deviceList, setDeviceList] = useState([]);
    const [checkedDeviceList, setCheckedDeviceList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: `View Topic: ${topicData.id}`,
        });
    }, [topicData]);

    // console.log("Devices", topicData.devices);
    // console.log("topicDeviceArray", topicDeviceArray);

    const onRefresh = useCallback(() => {
        async function prepare() {
            setRefreshing(true);
            setDeviceList([]);
            try {
                const freshData = await apiService.topic.getTopic(topicData.id);
                topicData = freshData.topic;
                console.log("topicData", topicData);

                const topicDeviceArray = topicData.devices.map((device) => device.id);

                const response = await apiService.device.getList();

                setDeviceList(response.devices);

                const checkedDeviceArray = response.devices.map((device) => {
                    return topicDeviceArray.indexOf(device.id) !== -1;
                });

                console.log("checkedDeviceArray", checkedDeviceArray);

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

    useEffect(onRefresh, []);

    const updateTopic = async (topicId, deviceIds) => {
        try {
            await apiService.topic.update(topicId, {
                // name: topicData.name,
                // description: topicData.description,
                deviceIds,
                // enabled: checked,
            });
            // navigation.goBack();
        } catch (error) {
            alert(error);
            console.error(error);
        }
    };

    const onChangeChecked = async (index) => {
        checkedDeviceList[index] = !checkedDeviceList[index];
        console.log("NEW checkedDeviceList", checkedDeviceList);
        setCheckedDeviceList(checkedDeviceList);

        const deviceIdList = checkedDeviceList
            //
            .map((checked, chkIndex) => {
                if (checked) {
                    return deviceList[chkIndex].id;
                }
                return null;
            })
            .filter(Boolean);

        console.log("deviceIdList", deviceIdList);

        await updateTopic(topicData.id, deviceIdList);
        onRefresh();
    };

    return (
        <SafeAreaView style={themedStyles.paneContainer}>
            <FlatList
                ListHeaderComponent={() => (
                    <View>
                        <Text style={themedStyles.baseText}>Name: {topicData.name || "Unnamed Topic"}</Text>

                        <Text style={themedStyles.baseText}>ID: {topicData.id}</Text>
                        <Text style={themedStyles.baseText}>Secret: {topicData.secretKey}</Text>

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
                renderItem={({ item, index }) => {
                    console.log("checkedDeviceList[index]", index, checkedDeviceList[index]);

                    return (
                        <List.Item
                            title={<Text style={themedStyles.baseText}>Name: {item.name}</Text>}
                            description={<Text style={themedStyles.baseText}>ID: {item.id}</Text>}
                            // description="Item description"
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
                    );
                }}
            />
        </SafeAreaView>
    );
};

export default ViewTopic;
