import React from "react";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";

import { View, useColorScheme } from "react-native";

import { Button } from "react-native-paper";

import styles from "../styles";

export const Separator = () => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    return <View style={themedStyles.separator} />;
};

export const CopyTextButton = (props) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    return (
        <Button
            onPress={async () => {
                await Clipboard.setStringAsync(props.text);

                let message = "✅ Copied topic key to clipboard. 🎉";
                if (props.successMessage) {
                    message = props.successMessage;
                }

                showToast(message);
            }}
            icon={props.icon || "copy"}
            mode={props.mode || "outlined"}
            color={props.color || "green"}
            style={{ flex: 1, margin: 10 }}
        >
            {props.children}
        </Button>
    );
};

export const showToast = (message) => {
    Toast.show(message, {
        duration: Toast.durations.SHORT,
        position: -65,
        backgroundColor: "#222222",
        animation: true,
    });
};
