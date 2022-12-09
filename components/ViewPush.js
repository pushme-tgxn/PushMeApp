import React, { useEffect, useContext } from "react";
import { SafeAreaView, View, ScrollView, useColorScheme } from "react-native";

import { Button, List, Text, Checkbox } from "react-native-paper";

import { AppReducer } from "../const";

import styles from "../styles";

const ViewPush = ({ navigation, route }) => {
    const { pushId } = route.params;

    const { state } = useContext(AppReducer);
    const thisPush = state.pushList[pushId];

    useEffect(() => {
        navigation.setOptions({
            title: `View Push: ${pushId}`,
        });
    }, [thisPush]);

    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    return (
        <SafeAreaView style={themedStyles.container.pane}>
            <View style={{ paddingTop: 10 }}>
                <Text variant="titleLarge">Push Recieved</Text>

                <Text variant="labelLarge">ID: {thisPush.id}</Text>
                <Text variant="labelLarge">
                    Request:
                    {thisPush.request}
                </Text>
                <Text variant="labelLarge">
                    Data:
                    {thisPush.pushPayload && JSON.stringify(thisPush.pushPayload)}
                </Text>

                <Text variant="titleLarge">Push Response</Text>

                <Text variant="labelLarge">
                    Response: {thisPush.response && JSON.stringify(thisPush.response)}
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default ViewPush;
