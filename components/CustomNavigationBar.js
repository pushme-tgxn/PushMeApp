import React, { useState, useContext } from "react";
import { useColorScheme } from "react-native";
import { Appbar, Button, Dialog, IconButton, Paragraph, Portal, TextInput } from "react-native-paper";

import { AppReducer } from "../const";
import { dispatchSDKError } from "../reducers/app";

import apiService from "../service/api";
import styles from "../styles";

function ViewTopicButtons({ navigation, topicData }) {
    const { state, dispatch } = useContext(AppReducer);

    const [topicName, setTopicName] = useState(topicData.name || "Unnamed Topic");

    const [editVisible, setEditVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const saveTopic = async () => {
        try {
            await apiService.topic.update(topicData.id, {
                name: topicName,
            });
            console.log("saved topic!");
        } catch (error) {
            dispatchSDKError(dispatch, error);
        } finally {
            setEditVisible(false);
        }
    };

    const deleteTopic = async () => {
        try {
            await apiService.topic.delete(topicData.id);
            console.log("deleted topic!");
            navigation.navigate("TopicList", { refresh: true });
        } catch (error) {
            dispatchSDKError(dispatch, error);
        } finally {
            setDeleteVisible(false);
        }
    };

    return (
        <React.Fragment>
            <IconButton icon="edit" size={20} onPress={() => setEditVisible(true)} />
            <IconButton icon="trash" size={20} onPress={() => setDeleteVisible(true)} />
            <Portal>
                <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
                    <Dialog.Title>Editing Topic {topicData.id}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={setTopicName}
                            value={topicName}
                            placeholder="Device Name"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditVisible(false)}>Cancel</Button>
                        <Button onPress={saveTopic}>Save</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Portal>
                <Dialog visible={deleteVisible} onDismiss={() => setDeleteVisible(false)}>
                    <Dialog.Title>Delete Topic {topicData.id}?</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>The topic and its secret will be forever deleted!</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteVisible(false)}>Cancel</Button>
                        <Button onPress={deleteTopic}>Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </React.Fragment>
    );
}

function ViewDeviceButtons({ navigation, deviceData }) {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state, dispatch } = useContext(AppReducer);

    const [deviceName, setDeviceName] = useState(deviceData.name || "Unnamed Device");

    const [editVisible, setEditVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const saveDevice = async () => {
        try {
            await apiService.device.update(deviceData.deviceKey, {
                name: deviceName,
            });
            console.log("saved device!");
        } catch (error) {
            dispatchSDKError(dispatch, error);
        } finally {
            setEditVisible(false);
        }
    };

    const deleteDevice = async () => {
        try {
            await apiService.device.delete(deviceData.id);
            console.log("deleted device!");
            navigation.navigate("ConfigScreen", { refresh: true });
        } catch (error) {
            dispatchSDKError(dispatch, error);
        } finally {
            setDeleteVisible(false);
        }
    };

    return (
        <React.Fragment>
            <IconButton icon="edit" size={20} onPress={() => setEditVisible(true)} />
            <IconButton icon="trash" size={20} onPress={() => setDeleteVisible(true)} />
            <Portal>
                <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
                    <Dialog.Title>Editing Device {deviceData.id}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            style={themedStyles.fields.inputStyle}
                            onChangeText={setDeviceName}
                            value={deviceName}
                            placeholder="Device Name"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditVisible(false)}>Cancel</Button>
                        <Button onPress={saveDevice}>Save</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Portal>
                <Dialog visible={deleteVisible} onDismiss={() => setDeleteVisible(false)}>
                    <Dialog.Title>Delete Device {deviceData.id}?</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>The device will be forever deleted!</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteVisible(false)}>Cancel</Button>
                        <Button onPress={deleteDevice}>Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </React.Fragment>
    );
}

export default function CustomNavigationBar({ navigation, route, back, options, ...others }) {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    let topicButtons = null;
    if (route.name == "ViewTopic") {
        topicButtons = <ViewTopicButtons topicData={route.params.topicData} navigation={navigation} />;
    } else if (route.name == "ViewDevice") {
        topicButtons = <ViewDeviceButtons deviceData={route.params.deviceData} navigation={navigation} />;
    }

    return (
        <Appbar.Header style={themedStyles.appBar} elevated={true}>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={options.title || "Topic Details"} />
            {back ? topicButtons : null}
        </Appbar.Header>
    );
}
