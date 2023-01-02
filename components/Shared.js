import React from "react";
import { View, useColorScheme } from "react-native";
import { Button, Text, Surface, TouchableRipple, useTheme } from "react-native-paper";

import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";

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
            style={{ ...props.style, flex: 1 }}
        >
            {props.children}
        </Button>
    );
};

export const showToast = (message) => {
    Toast.show(message, {
        duration: Toast.durations.SHORT,
        position: -110,
        backgroundColor: "#222222",
        animation: true,
    });
};

export const TwoLineButton = (props) => {
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { title, subtitle, onPress, key } = props;
    return (
        <Surface
            key={key}
            style={[{ marginBottom: 10, borderRadius: 5, backgroundColor: theme.colors.surfaceVariant }]}
        >
            <TouchableRipple style={[{ flex: 1, padding: 10, paddingLeft: 20 }]} onPress={onPress}>
                <Text>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{title}</Text>
                    <Text style={{ height: 20 }}>{"\n"}</Text>
                    <Text style={{ fontWeight: "italic", fontSize: 16 }}>{subtitle}</Text>
                </Text>
            </TouchableRipple>
        </Surface>
    );
};
