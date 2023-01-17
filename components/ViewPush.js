import React, { useEffect, useState, useContext, useCallback } from "react";
import { SafeAreaView, FlatList, View, useColorScheme } from "react-native";
import { Text } from "react-native-paper";

import { Separator } from "../components/Shared";

import { AppReducer } from "../const";
import { dispatchSDKError } from "../reducers/app";

import apiService from "../service/api";
import styles from "../styles";

const ViewPush = ({ navigation, route }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state, dispatch } = useContext(AppReducer);

    const [refreshing, setRefreshing] = useState(false);
    const [pushStatus, setPushStatus] = useState(null);

    const { pushId } = route.params;

    // load the push from global state
    const thisPush = state.pushList[pushId];

    if (!thisPush) return null;
    console.log("ViewPush:", pushId, thisPush);

    // function called to refresh the push status
    const onRefresh = useCallback(() => {
        async function prepare() {
            if (!pushId) return;

            setRefreshing(true);
            setPushStatus(null);

            const thisPush = state.pushList[pushId];

            try {
                const response = await apiService.push.getPushStatus(thisPush.pushIdent);
                setPushStatus(response);
            } catch (error) {
                dispatchSDKError(dispatch, error);
            } finally {
                setRefreshing(false);
            }
        }
        prepare();
    }, [pushId]);

    // update when the screen's pushId changes
    useEffect(() => {
        navigation.setOptions({
            title: thisPush.pushPayload.title,
        });

        onRefresh();
    }, [pushId]);

    return (
        <SafeAreaView style={themedStyles.container.pane}>
            <FlatList
                ListHeaderComponent={() => (
                    <View>
                        <View>
                            {/* service request */}
                            {/* <Text variant="titleLarge">Service Request</Text> */}
                            <Text variant="labelLarge">Title: {thisPush.pushPayload.title}</Text>
                            <Text variant="labelLarge">Body: {thisPush.pushPayload.body}</Text>
                            <Text variant="labelLarge">Category: {thisPush.pushPayload.categoryId}</Text>
                            {/* {thisPush.pushPayload.data && (
                                <Text variant="labelLarge">
                                    Data:
                                    {JSON.stringify(thisPush.pushPayload.data)}
                                </Text>
                            )}
                            <Separator /> */}
                            {/* push data */}
                            <Text variant="labelLarge">Ident: {thisPush.pushIdent}</Text>
                            <Text variant="labelLarge">Push ID: {thisPush.id}</Text>
                            <Separator />
                            {/* local response */}
                            {/* <Text variant="titleLarge">Local Response</Text>
                            <Text variant="labelLarge">
                            {thisPush.response && JSON.stringify(thisPush.response)}
                            </Text>
                        <Separator /> */}
                            {/* first valid response */}
                            {pushStatus && pushStatus.firstValidResponse && (
                                <View>
                                    <Text variant="titleLarge">First Response</Text>
                                    <Text variant="labelLarge">
                                        Action Ident: {pushStatus.firstValidResponse.actionIdentifier}
                                    </Text>
                                    {pushStatus.firstValidResponse.responseText && (
                                        <Text variant="labelLarge">
                                            responseText: {pushStatus.firstValidResponse.responseText}
                                        </Text>
                                    )}
                                    {/* <Text variant="labelLarge">
                                        {pushStatus &&
                                            pushStatus.firstValidResponse &&
                                            JSON.stringify(pushStatus.firstValidResponse)}
                                    </Text> */}
                                    <Separator />
                                </View>
                            )}
                            {/* remote response */}
                            {/* <Text variant="titleLarge">Push Status</Text>
                            <Text variant="labelLarge">{pushStatus && JSON.stringify(pushStatus)}</Text>
                            <Separator /> */}
                        </View>

                        <Text variant="titleLarge" style={{ marginBottom: 10 }}>
                            {refreshing
                                ? "Responses Loading..."
                                : pushStatus && pushStatus.serviceResponses.length == 0
                                ? "No Responses!"
                                : "Push Responses"}
                        </Text>
                    </View>
                )}
                data={pushStatus ? pushStatus.serviceResponses : []}
                onRefresh={onRefresh}
                refreshing={refreshing}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    // let isThisDevice = item.deviceKey == state.deviceKey;
                    // console.log("ViewPushRESPONSE: item", item);
                    const parsedResponse = JSON.parse(item.serviceResponse);
                    return (
                        <View key={item}>
                            <Text variant="labelLarge">ActionIdent {parsedResponse.actionIdentifier}</Text>
                            <Text variant="labelLarge">createdAt: {item.createdAt}</Text>
                            {parsedResponse.responseText && (
                                <Text variant="labelLarge">responseText: {parsedResponse.responseText}</Text>
                            )}
                            <Separator />
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
};

export default ViewPush;
