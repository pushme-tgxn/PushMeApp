import React, { useState, useEffect, useContext, useCallback } from "react";

import { SafeAreaView, FlatList, Text, ScrollView, useColorScheme, View } from "react-native";

import { Checkbox } from "react-native-paper";

import { AppReducer } from "../const";

import apiService from "../service/api";

import styles from "../styles";

const ViewTopic = ({ navigation, route }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state } = useContext(AppReducer);

    const { topicData, topicIndex } = route.params;

    const [deviceList, setDeviceList] = useState([]);
    const [checkedDeviceList, setCheckedDeviceList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: `View Topic: ${topicData.id}`,
        });
    }, [topicData]);

    console.log("Devices", topicData.devices);
    const topicDeviceArray = topicData.devices.map((device) => device.id);
    console.log("topicDeviceArray", topicDeviceArray);

    const onRefresh = useCallback(() => {
        async function prepare() {
            setRefreshing(true);
            setDeviceList([]);
            try {
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

        await updateTopic(
            topicData.id,
            checkedDeviceList
                .filter((checked) => checked)
                .map((checked) => {
                    if (checked) {
                        return deviceList[index].id;
                    }
                }),
        );
    };

    return (
        <SafeAreaView style={themedStyles.paneContainer}>
            <FlatList
                data={deviceList}
                ListHeaderComponent={() => (
                    <View>
                        <Text style={themedStyles.headerText}>Topic</Text>

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
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderItem={({ item, index }) => {
                    console.log("checkedDeviceList[index]", index, checkedDeviceList[index]);

                    return (
                        <Text style={themedStyles.baseText}>
                            ID: {item.id}
                            name: {item.name}
                            <Checkbox
                                status={checkedDeviceList[index] ? "checked" : "unchecked"}
                                onPress={() => {
                                    onChangeChecked(index);
                                }}
                            />
                        </Text>
                    );
                }}
            />
        </SafeAreaView>
    );
};

export default ViewTopic;
