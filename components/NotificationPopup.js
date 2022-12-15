import React, { useState } from "react";

import { SafeAreaView, View, useColorScheme } from "react-native";

import {
    Appbar,
    Menu,
    IconButton,
    Colors,
    Button,
    Modal,
    Dialog,
    Portal,
    Paragraph,
} from "react-native-paper";

import * as Notifications from "expo-notifications";
// import { Picker } from "@react-native-picker/picker";

// import { PaperSelect } from "react-native-paper-select";

import DropDown from "react-native-paper-dropdown";

import { Separator } from "../components/Shared";

import { useTheme } from "react-native-paper";

import { NotificationCategories } from "../const";

import apiService from "../service/api";
import styles from "../styles";

export default function NotificationPopup() {
    const theme = useTheme();
    const colorScheme = useColorScheme();

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [pushContent, setPushContent] = useState(null);

    const themedStyles = styles(colorScheme);

    const lastNotificationResponse = Notifications.useLastNotificationResponse();

    React.useEffect(() => {
        if (!lastNotificationResponse) return;

        console.log("lastNotificationResponse", lastNotificationResponse);
        setPushContent(lastNotificationResponse.notification.request.content);

        // only load for the default type
        if (
            lastNotificationResponse &&
            lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
        ) {
            setVisible(true);
        }
    }, [lastNotificationResponse]);

    return (
        <Portal>
            <Modal
                style={{ backgroundColor: "#000000FF" }}
                visible={visible}
                onDismiss={() => setVisible(false)}
                contentContainerStyle={{
                    backgroundColor: theme.colors.backdrop,
                    margin: 20,
                }}
            >
                <Dialog.Title>Incoming Push</Dialog.Title>
                <Dialog.Content>
                    {lastNotificationResponse && pushContent && (
                        <View>
                            <Paragraph>
                                actionIdentifier: {lastNotificationResponse.actionIdentifier}
                            </Paragraph>
                            <Paragraph>title: {pushContent.title}</Paragraph>
                            <Paragraph>body: {pushContent.body}</Paragraph>
                            <Paragraph>categoryIdentifier: {pushContent.categoryIdentifier}</Paragraph>
                            <Paragraph>pushIdent: {pushContent.data.pushIdent}</Paragraph>
                            <Paragraph>pushId: {pushContent.data.pushId}</Paragraph>
                            <Separator />
                            <Paragraph>{JSON.stringify(lastNotificationResponse)}</Paragraph>
                        </View>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setVisible(false)}>Thanks</Button>
                    {/* <Button loading={loading}>Approve</Button>
                    <Button loading={loading}>Reject</Button> */}
                </Dialog.Actions>
            </Modal>
        </Portal>
    );
}
