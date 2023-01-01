import React, { useState, useEffect } from "react";

import { View, useColorScheme } from "react-native";

import { Button, Modal, Dialog, Portal, TextInput } from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { showToast } from "./Shared";

import { useTheme } from "react-native-paper";

import { BACKEND_URL } from "../const";

import apiService from "../service/api";
import styles from "../styles";

export default function ModalPopup({ visible, setVisible }) {
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    let currentBackendUrl = apiService.getBackendUrl();
    let isDefaultBackend = currentBackendUrl == BACKEND_URL;

    const [backendUrl, setBackendUrl] = useState("");

    const onSubmit = async () => {
        if (backendUrl != "") {
            apiService.setBackendUrl(backendUrl);
            AsyncStorage.setItem("backendUrl", backendUrl);
        }
        setBackendUrl("");
        setVisible(false);
        showToast("✅ Server updated. 🎉");
    };

    const onReset = async () => {
        apiService.setBackendUrl(BACKEND_URL);
        AsyncStorage.removeItem("backendUrl");
        setBackendUrl("");
        setVisible(false);
        showToast("✅ Server reset to default. 🎉");
    };

    /// update variables when popup is shown
    useEffect(() => {
        currentBackendUrl = apiService.getBackendUrl();
        isDefaultBackend = currentBackendUrl == BACKEND_URL;
    }, [visible]);

    return (
        <React.Fragment>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={{ backgroundColor: theme.colors.background, margin: 20 }}
                >
                    <Dialog.Title>Server Settings</Dialog.Title>
                    <Dialog.Content>
                        <View>
                            <TextInput
                                style={themedStyles.fields.inputStyle}
                                onChangeText={setBackendUrl}
                                value={backendUrl}
                                placeholder={`${currentBackendUrl} (${
                                    isDefaultBackend ? "default" : "custom"
                                })`}
                                autoCapitalize="none"
                                autoComplete="off"
                            />
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={() => {
                                setBackendUrl("");
                                setVisible(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button disabled={isDefaultBackend} onPress={onReset}>
                            Reset to Default
                        </Button>
                        <Button disabled={backendUrl == ""} onPress={onSubmit}>
                            Update
                        </Button>
                    </Dialog.Actions>
                </Modal>
            </Portal>
        </React.Fragment>
    );
}
