import React from "react";
import { View, useColorScheme } from "react-native";

import Toast from "react-native-root-toast";

import styles from "../styles";

export const Separator = () => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    return <View style={themedStyles.separator} />;
};

export const showToast = (message) => {
    Toast.show(message, {
        duration: Toast.durations.SHORT,
        position: -110,
        backgroundColor: "#222222",
        animation: true,
    });
};
