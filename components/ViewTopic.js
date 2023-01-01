import React, { useState, useEffect, useContext, useCallback } from "react";

import { SafeAreaView, FlatList, useColorScheme, View } from "react-native";

import { Button, List, Text, Checkbox } from "react-native-paper";

import { CopyTextButton } from "../components/Shared";

import { AppReducer } from "../const";
import { dispatchSDKError } from "../reducers/app";

import PushPopup from "./PushPopup";

import apiService from "../service/api";
import styles from "../styles";

const ViewTopic = ({ navigation, route }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state, dispatch } = useContext(AppReducer);

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
                const freshData = await apiService.topic.getById(topicData.id);
                topicData = freshData.topic;
                console.log("refreshed topicData", topicData.id);

                const topicDeviceArray = topicData.devices.map((device) => device.id);

                const response = await apiService.device.list();

                setDeviceList(response.devices);

                const checkedDeviceArray = response.devices.map((device) => {
                    return topicDeviceArray.indexOf(device.id) !== -1;
                });

                setCheckedDeviceList(checkedDeviceArray);
            } catch (error) {
                dispatchSDKError(dispatch, error);
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
            dispatchSDKError(dispatch, error);
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
        <SafeAreaView style={themedStyles.container.pane}>
            <FlatList
                ListHeaderComponent={() => (
                    <View>
                        {topicData.name && <Text variant="labelLarge">Name: {topicData.name}</Text>}

                        <Text variant="labelLarge">ID: {topicData.id}</Text>
                        <Text variant="labelLarge">Key: {topicData.topicKey}</Text>
                        <Text variant="labelLarge">Secret: {topicData.secretKey}</Text>

                        <View style={{ flexDirection: "row", alignContent: "center" }}>
                            <Button
                                onPress={async () => {
                                    setVisible(true);
                                }}
                                icon="check"
                                mode="contained"
                                color="purple"
                                style={{ flex: 1, marginVertical: 10 }}
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
                            <CopyTextButton
                                text={topicData.topicKey}
                                successMessage={"✅ Copied topic key to clipboard. 🎉"}
                                style={{ marginVertical: 5, marginRight: 10 }}
                                mode="outlined"
                                color="green"
                            >
                                Copy Key
                            </CopyTextButton>

                            <CopyTextButton
                                text={topicData.secretKey}
                                successMessage={"✅ Copied topic secret to clipboard. 🤫"}
                                style={{ marginVertical: 5 }}
                                mode="outlined"
                                color="orange"
                            >
                                Copy Secret
                            </CopyTextButton>
                        </View>
                        <Text variant="titleLarge" style={{ paddingTop: 10 }}>
                            {refreshing
                                ? "Devices Loading..."
                                : deviceList.length == 0
                                ? "No Devices!"
                                : "Subscribed Devices"}
                        </Text>
                    </View>
                )}
                data={deviceList}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderItem={({ item, index }) => (
                    <List.Item
                        title={<Text>Name: {item.name}</Text>}
                        description={<Text>ID: {item.id}</Text>}
                        left={() => (
                            <Checkbox
                                status={checkedDeviceList[index] ? "checked" : "unchecked"}
                                onPress={() => {
                                    onChangeChecked(index);
                                }}
                            />
                        )}
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default ViewTopic;
