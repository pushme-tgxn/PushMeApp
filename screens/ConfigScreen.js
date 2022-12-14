import React, { useState, useEffect, useContext, useCallback } from "react";

import { SafeAreaView, FlatList, ScrollView, useColorScheme, View } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";

import { createStackNavigator } from "@react-navigation/stack";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppReducer } from "../const";
import { setUserData } from "../reducers/app";

import { Separator } from "../components/Shared";

import CustomNavigationBar from "../components/CustomNavigationBar";

import ViewTopic from "../components/ViewTopic";
import ViewDevice from "../components/ViewDevice";

import apiService from "../service/api";
import styles from "../styles";

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

const ConfigScreen = ({ navigation, route }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state, dispatch } = useContext(AppReducer);

    const [tokenList, setTokenList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUserData, setCurrentUserData] = useState(false);

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

    useEffect(() => {
        if (route?.params?.refresh) {
            console.log("refreshing devices");
            onRefresh();
        }
    }, [route]);

    useEffect(() => {
        async function prepare() {
            const currentUser = await apiService.user.getCurrentUser();
            console.log("currentUser", currentUser);
            setCurrentUserData(currentUser);
        }
        prepare();
    }, []);

    return (
        <SafeAreaView style={[themedStyles.container.base]}>
            <FlatList
                ListHeaderComponent={() => (
                    <View>
                        <Text variant="displaySmall" style={{ marginBottom: 10 }}>
                            Account
                        </Text>

                        <Text variant="labelLarge">User ID: {state.user.id}</Text>
                        <Text variant="labelLarge">Registered: {state.user.createdAt}</Text>
                        {currentUserData && (
                            <Text variant="labelLarge" style={{ marginBottom: 10 }}>
                                Login Method:{" "}
                                {currentUserData.methods.map((method) => method.method).join(", ")}
                            </Text>
                        )}

                        <Button
                            onPress={async () => {
                                await AsyncStorage.removeItem("userData");
                                dispatch(setUserData(null));

                                // navigation.replace("Auth");
                            }}
                            icon="sign-out-alt"
                            contentStyle={themedStyles.button.iconRight}
                            mode="contained"
                        >
                            Logout
                        </Button>

                        <Separator />

                        <Text variant="displaySmall" style={{ marginBottom: 10 }}>
                            This Device
                        </Text>

                        <Text variant="labelLarge">
                            Device Ident: {state.deviceKey ? state.deviceKey : "Loading..."}
                        </Text>

                        <Text variant="labelLarge">
                            Token: {state.expoPushToken ? state.expoPushToken : "Loading..."}
                        </Text>

                        <Text variant="labelLarge" style={{ marginBottom: 10 }}>
                            Native Token:{" "}
                            {state.nativePushToken
                                ? `${state.nativePushToken.type} ${state.nativePushToken.data.substring(
                                      1,
                                      20,
                                  )}...`
                                : "Loading..."}
                        </Text>

                        <Separator />
                        <Text variant="titleLarge" style={{ marginBottom: 10 }}>
                            {refreshing
                                ? "Devices Loading..."
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
                    let isThisDevice = item.deviceKey == state.deviceKey;
                    return (
                        <Button
                            style={[themedStyles.button.bigButton, themedStyles.button.listButton]}
                            onPress={async () => {
                                navigation.navigate("ViewDevice", { deviceData: item });
                            }}
                            mode={isThisDevice ? "contained" : "contained-tonal"}
                        >
                            {item.name ? item.name : "Unnamed Device"}
                            {isThisDevice && " (This Device)"}
                        </Button>
                    );
                }}
            />
        </SafeAreaView>
    );
};

export default ConfigStack;
