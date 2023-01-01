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

    const { pushId } = route.params;

    const { state, dispatch } = useContext(AppReducer);
    const thisPush = state.pushList[pushId];

    const [pushStatus, setPushStatus] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // when the screen's pushId changes
    useEffect(() => {
        navigation.setOptions({
            title: `View Push: ${pushId}`,
        });

        onRefresh();
    }, [thisPush]);
    console.log("ViewPush: thisPush", thisPush);

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

    console.log("ViewPush: pushStatus", thisPush);

    return (
        <SafeAreaView style={themedStyles.container.pane}>
            <FlatList
                ListHeaderComponent={() => (
                    <View>
                        <View>
                            {/* push data */}

                            <Text variant="labelLarge">Identifier: {thisPush.pushIdent}</Text>
                            <Text variant="labelLarge">Push ID: {thisPush.id}</Text>
                            <Separator />

                            {/* service request */}
                            <Text variant="titleLarge">Request:</Text>
                            <Text variant="labelLarge">
                                {thisPush.pushPayload && JSON.stringify(thisPush.pushPayload)}
                            </Text>
                            <Separator />

                            {/* local response */}
                            <Text variant="titleLarge">Local Response</Text>
                            <Text variant="labelLarge">
                                {thisPush.response && JSON.stringify(thisPush.response)}
                            </Text>
                            <Separator />

                            {/* first valid response */}
                            <Text variant="titleLarge">First Valid Response</Text>
                            <Text variant="labelLarge">
                                {pushStatus &&
                                    pushStatus.firstValidResponse &&
                                    JSON.stringify(pushStatus.firstValidResponse)}
                            </Text>
                            <Separator />

                            {/* remote response */}
                            <Text variant="titleLarge">Push Status</Text>
                            <Text variant="labelLarge">{pushStatus && JSON.stringify(pushStatus)}</Text>
                            <Separator />
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
