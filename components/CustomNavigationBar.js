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
    const [visible, setVisible] = useState(false);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const deleteTopic = async () => {
        await apiService.topic.delete(topicData.id);
        hideDialog();
        console.log("deleted!");
        navigation.navigate("ViewTopics");
    };

    const saveTopic = async () => {
        await apiService.topic.update(topicData.id, {
            name: topicName,
        });
        hideDialog();
        console.log("saved!");
    };

    return (
        <React.Fragment>
            <IconButton icon="edit" color={Colors.blue400} size={20} onPress={showDialog} />
            <IconButton icon="trash" color={Colors.red600} size={20} onPress={showDialog} />
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Delete Topic {topicData.id}?</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>The topic and its secret will be forever deleted!</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Cancel</Button>
                        <Button onPress={deleteTopic}>Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
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
                        <Button onPress={hideDialog}>Cancel</Button>
                        <Button onPress={saveTopic}>Save</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </React.Fragment>
    );
}

export default function CustomNavigationBar({ navigation, route, back, options, ...others }) {
    // console.log(navigation, route, back, others);

    let topicButtons = null;
    if (route.name == "ViewTopic") {
        topicButtons = <ViewTopicButtons topicData={route.params.topicData} navigation={navigation} />;
    }

    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={options.title || "Topic Details"} />
            {back ? topicButtons : null}
        </Appbar.Header>
    );
}
