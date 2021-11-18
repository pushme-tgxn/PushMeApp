import React, { useState } from "react";
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

import apiService from "../service/api";

import styles from "../styles";

function ViewTopicButtons({ navigation, topicData }) {
    const [topicName, setTopicName] = useState(topicData.name || "Unnamed Topic");

    const [editVisible, setEditVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const saveTopic = async () => {
        await apiService.topic.update(topicData.id, {
            name: topicName,
        });
        setEditVisible(false);
        console.log("saved!");
    };

    const deleteTopic = async () => {
        await apiService.topic.delete(topicData.id);
        setDeleteVisible(false);
        console.log("deleted!");
        navigation.navigate("ViewTopics");
    };

    return (
        <React.Fragment>
            <IconButton icon="edit" color={Colors.blue400} size={20} onPress={() => setEditVisible(true)} />
            <IconButton icon="trash" color={Colors.red600} size={20} onPress={() => setDeleteVisible(true)} />
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
    const [deviceName, setDeviceName] = useState(deviceData.name || "Unnamed Device");

    const [editVisible, setEditVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const saveDevice = async () => {
        await apiService.device.upsertRegistration({
            name: deviceName,
            token: deviceData.token,
        });

        setEditVisible(false);
    };

    const deleteDevice = async () => {
        await apiService.device.deleteRegistration(deviceData.id);

        setDeleteVisible(false);
        navigation.navigate("ViewDevice");
    };

    return (
        <React.Fragment>
            <IconButton icon="edit" color={Colors.blue400} size={20} onPress={() => setEditVisible(true)} />
            <IconButton icon="trash" color={Colors.red600} size={20} onPress={() => setDeleteVisible(true)} />
            <Portal>
                <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
                    <Dialog.Title>Editing Device {deviceData.id}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            style={styles.inputStyle}
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
    let topicButtons = null;
    if (route.name == "ViewTopic") {
        topicButtons = <ViewTopicButtons topicData={route.params.topicData} navigation={navigation} />;
    } else if (route.name == "ViewDevice") {
        topicButtons = <ViewDeviceButtons deviceData={route.params.deviceData} navigation={navigation} />;
    }

    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={options.title || "Topic Details"} />
            {back ? topicButtons : null}
        </Appbar.Header>
    );
}
