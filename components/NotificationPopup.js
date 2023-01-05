import React, { useState, useEffect, useContext } from "react";
import { View, useColorScheme } from "react-native";
import { Button, Modal, Dialog, Portal, Paragraph, TextInput, useTheme } from "react-native-paper";

import * as Notifications from "expo-notifications";

import { AppReducer } from "../const";
import { setPushResponse } from "../reducers/app";

import { Separator } from "../components/Shared";

import styles from "../styles";
import apiService from "../service/api";

export default function NotificationPopup() {
    const theme = useTheme();
    const colorScheme = useColorScheme();

    const { state, dispatch } = useContext(AppReducer);

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [pushContent, setPushContent] = useState(null);
    const [pushCategory, setPushCategory] = useState(null);

    const [pushResponseText, setPushResponseText] = useState("");

    const themedStyles = styles(colorScheme);

    const lastNotificationResponse = Notifications.useLastNotificationResponse();

    useEffect(() => {
        if (!lastNotificationResponse) return;

        console.log("lastNotificationResponse", lastNotificationResponse.notification.request.content);
        setPushContent(lastNotificationResponse.notification.request.content);

        const foundCategory = apiService.getNotificationCategory(
            lastNotificationResponse.notification.request.content.categoryIdentifier,
        );
        setPushCategory(foundCategory);
        console.log("pushCategory", foundCategory);

        // only load for the default type, or if default action is not sent
        if (
            lastNotificationResponse &&
            lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER &&
            (!pushCategory || !pushCategory.sendDefaultAction)
        ) {
            setVisible(true);
        }
    }, [lastNotificationResponse]);

    if (!pushCategory) return null;

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
                <Dialog.Title>{pushContent.title}</Dialog.Title>
                <Dialog.Content>
                    {lastNotificationResponse && pushContent && (
                        <View>
                            {/* <Paragraph>
                                actionIdentifier: {lastNotificationResponse.actionIdentifier}
                            </Paragraph> */}
                            {/* <Paragraph>{pushContent.title}</Paragraph> */}
                            <Paragraph>{pushContent.body}</Paragraph>
                            {/* <Paragraph>categoryIdentifier: {pushContent.categoryIdentifier}</Paragraph> */}
                            {/* <Paragraph>pushIdent: {pushContent.data.pushIdent}</Paragraph> */}
                            {/* <Paragraph>pushId: {pushContent.data.pushId}</Paragraph> */}
                            {/* <Separator /> */}
                            {/* <Paragraph>{JSON.stringify(lastNotificationResponse)}</Paragraph> */}
                        </View>
                    )}
                    {pushCategory.hasTextInput && (
                        <TextInput
                            mode="outlined"
                            style={{ backgroundColor: theme.colors.surface }}
                            value={pushResponseText}
                            onChangeText={setPushResponseText}
                        />
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    {pushCategory.actions.map((action) => (
                        <Button
                            disabled={pushCategory.hasTextInput ? pushResponseText.length == 0 : false}
                            onPress={() => {
                                const responseData = {
                                    pushIdent: pushContent.data.pushIdent,
                                    pushId: pushContent.data.pushId,
                                    actionIdentifier: action.identifier,
                                    categoryIdentifier: pushContent.categoryIdentifier,
                                    responseText: pushCategory.hasTextInput ? pushResponseText : null,
                                };
                                dispatch(setPushResponse(responseData));

                                setPushResponseText("");
                                setPushCategory(null);
                                setVisible(false);
                            }}
                        >
                            {action.title}
                        </Button>
                    ))}
                    <Button onPress={() => setVisible(false)}>Dismiss</Button>
                </Dialog.Actions>
            </Modal>
        </Portal>
    );
}
