import React, { useEffect, useContext } from "react";

import { SafeAreaView, ScrollView, Text, View, useColorScheme } from "react-native";

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
        <SafeAreaView style={themedStyles.paneContainer}>
            <ScrollView>
                <Text style={themedStyles.headerText}>Push Recieved</Text>

                <Text style={themedStyles.baseText}>ID: {thisPush.id}</Text>
                <Text style={themedStyles.baseText}>
                    Request:
                    {thisPush.request}
                </Text>
                <Text style={themedStyles.baseText}>
                    Data:
                    {thisPush.pushPayload && JSON.stringify(thisPush.pushPayload)}
                </Text>

                <Text style={themedStyles.headerText}>Push Response</Text>

                <Text style={themedStyles.baseText}>
                    Response: {thisPush.response && JSON.stringify(thisPush.response)}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewPush;
