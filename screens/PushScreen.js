import React, { useState, useEffect, useContext, useCallback } from "react";

import { SafeAreaView, FlatList, RefreshControl, useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { Text, Button } from "react-native-paper";

import { AppReducer } from "../const";
import { dispatchSDKError, setPushList } from "../reducers/app";

import { TwoLineButton } from "../components/Shared";
import ViewPush from "../components/ViewPush";
import CustomNavigationBar from "../components/CustomNavigationBar";

import apiService from "../service/api";
import styles from "../styles";

const Stack = createStackNavigator();
const PushScreen = () => {
    return (
        <Stack.Navigator
            initialRouteName="PushList"
            screenOptions={{
                header: CustomNavigationBar,
            }}
        >
            <Stack.Screen name="PushList" component={PushList} options={{ headerShown: false }} />
            <Stack.Screen name="ViewPush" component={ViewPush} />
        </Stack.Navigator>
    );
};

const PushList = ({ navigation, route }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state, dispatch } = useContext(AppReducer);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        async function prepare() {
            setRefreshing(true);
            dispatch(setPushList([]));

            try {
                const response = await apiService.user.getPushHistory();
                dispatch(setPushList(response.pushes));
            } catch (error) {
                dispatchSDKError(dispatch, error);
            } finally {
                setRefreshing(false);
            }
        }
        prepare();
    }, []);

    useEffect(onRefresh, []);

    useEffect(() => {
        if (route?.params?.refresh) {
            console.log("refreshing pushlist");
            onRefresh();
        }
    }, [route]);

    // reverse push history list
    // TODO(server) do server-side (request `order` param)
    const pushArray = [];
    Object.keys(state.pushList).map((pushId) => {
        pushArray.push(state.pushList[pushId]);
    });
    pushArray.reverse();

    return (
        <SafeAreaView style={[themedStyles.container.base]}>
            <FlatList
                ListHeaderComponent={() => (
                    <Text variant="displaySmall" style={{ marginBottom: 10 }}>
                        {refreshing
                            ? "List Loading..."
                            : pushArray.length == 0
                            ? "No History!"
                            : "Push History"}
                    </Text>
                )}
                data={pushArray}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    return (
                        <TwoLineButton
                            // key={item.id}
                            onPress={async () => {
                                navigation.navigate("ViewPush", { pushId: item.id });
                            }}
                            title={`${item.id}: ${item.createdAt}`}
                            subtitle={item.createdAt}
                        />
                    );
                }}
            />
        </SafeAreaView>
    );
};

export default PushScreen;
