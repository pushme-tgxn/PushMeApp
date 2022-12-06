import React, { useState, useEffect, useContext, useCallback } from "react";

import { SafeAreaView, FlatList, Text, ScrollView, useColorScheme, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { createStackNavigator } from "@react-navigation/stack";

import AsyncStorage from "@react-native-async-storage/async-storage";

import apiService from "../service/api";

import { AppReducer } from "../const";
import { setUserData } from "../reducers/app";

import { Separator, CustomButton } from "../components/Shared";
import CustomNavigationBar from "../components/CustomNavigationBar";

import ViewTopic from "../components/ViewTopic";
import ViewDevice from "../components/ViewDevice";

import styles from "../styles";

const ConfigScreen = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state, dispatch } = useContext(AppReducer);

    const [tokenList, setTokenList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        async function prepare() {
            setRefreshing(true);
            setTokenList([]);
            try {
                const response = await apiService.device.getList();

                setTokenList(response.devices);
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
    return (
        <SafeAreaView style={themedStyles.screenContainer}>
            <FlatList
                ListHeaderComponent={() => (
                    <View>
                        <Text style={themedStyles.headerText}>Account</Text>

                        {/* <Text style={themedStyles.baseText}>Email: {state.user.email}</Text> */}
                        <Text style={themedStyles.baseText}>Registered: {state.user.createdAt}</Text>

                        <Button
                            onPress={async () => {
                                await AsyncStorage.removeItem("userData");
                                dispatch(setUserData(null));

                                // navigation.replace("Auth");
                            }}
                            icon="sign-out-alt"
                            mode="contained"
                            color="red"
                            // onPress={async () => {
                            //     await AsyncStorage.removeItem("userData");
                            //     dispatch(setUserData(null));

                            //     // navigation.replace("Auth");
                            // }}
                        >
                            Logout
                        </Button>
                        {/* <CustomButton
                            onPress={async () => {
                                await AsyncStorage.removeItem("userData");
                                dispatch(setUserData(null));

                                // navigation.replace("Auth");
                            }}
                            title="Logout"
                            style={{ backgroundColor: "red" }}
                        /> */}
                        <Separator />

                        <Text style={themedStyles.headerText}>This Device</Text>

                        <Text style={themedStyles.baseText}>
                            Token: {state.expoPushToken ? state.expoPushToken : "Loading..."}
                        </Text>

                        <Separator />
                        <Text style={themedStyles.headerText}>
                            {refreshing
                                ? "List Loading..."
                                : tokenList.length == 0
                                ? "No Devices!"
                                : "Active Devices"}
                        </Text>
                    </View>
                )}
                data={tokenList}
                onRefresh={onRefresh}
                refreshing={refreshing}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    let isThisDevice = item.token == state.expoPushToken;
                    let buttonStyle = themedStyles.listItem;
                    if (isThisDevice) {
                        buttonStyle = [themedStyles.listItem, { backgroundColor: "red" }];
                    }
                    return (
                        <CustomButton
                            onPress={async () => {
                                navigation.navigate("ViewDevice", { deviceData: item });
                            }}
                            style={buttonStyle}
                        >
                            {item.name ? item.name : "Unnamed Device"}
                            {isThisDevice && " (This Device)"}
                        </CustomButton>
                    );
                }}
            />
        </SafeAreaView>
    );
};

const Stack = createStackNavigator();
const ConfigStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="ConfigScreen"
            screenOptions={{
                header: CustomNavigationBar,
            }}
        >
            <Stack.Screen name="ConfigScreen" component={ConfigScreen} options={{ headerShown: false }} />

            <Stack.Screen name="ViewDevice" component={ViewDevice} />
            <Stack.Screen name="ViewTopic" component={ViewTopic} />
        </Stack.Navigator>
    );
};

export default ConfigStack;
