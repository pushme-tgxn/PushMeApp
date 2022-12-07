import React, { useState, useEffect, useContext, useCallback } from "react";

import { SafeAreaView, FlatList, Text, useColorScheme } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import { Separator, CustomButton } from "../components/Shared";

import { setPushList } from "../reducers/app";

import ViewPush from "../components/ViewPush";
import CustomNavigationBar from "../components/CustomNavigationBar";

import { AppReducer } from "../const";

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

const PushList = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state, dispatch } = useContext(AppReducer);

    const [refreshing, setRefreshing] = useState(false);

    // const [pushModalOpen, setPushModalOpen] = useState(false);

    const onRefresh = useCallback(() => {
        async function prepare() {
            setRefreshing(true);
            dispatch(setPushList([]));
            try {
                const response = await apiService.user.getPushHistory();

                dispatch(setPushList(response.pushes));
            } catch (error) {
                alert(error);
                console.error(error);
            } finally {
                setRefreshing(false);
            }
        }
        prepare();
    }, []);

    useEffect(onRefresh, []);

    const pushArray = [];
    Object.keys(state.pushList).map((pushId) => {
        pushArray.push(state.pushList[pushId]);
    });
    pushArray.reverse();

    return (
        <SafeAreaView style={themedStyles.screenContainer}>
            <FlatList
                ListHeaderComponent={() => (
                    <Text style={themedStyles.headerText}>
                        {refreshing
                            ? "List Loading..."
                            : pushArray.length == 0
                            ? "No History!"
                            : "Push History"}
                    </Text>
                )}
                data={pushArray}
                onRefresh={onRefresh}
                refreshing={refreshing}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    return (
                        <CustomButton
                            onPress={async () => {
                                navigation.navigate("ViewPush", { pushId: item.id });
                            }}
                            style={themedStyles.listItem}
                        >
                            {item.id}: {item.createdAt}
                        </CustomButton>
                    );
                }}
            />
        </SafeAreaView>
    );
};

export default PushScreen;
