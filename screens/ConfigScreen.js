import React, { useState, useEffect, useContext, useCallback } from "react";
import { SafeAreaView, FlatList, RefreshControl, Alert, useColorScheme, View } from "react-native";
import { Text, Button, IconButton, Dialog, Paragraph, Portal, useTheme } from "react-native-paper";

import { createStackNavigator } from "@react-navigation/stack";

import { AppReducer, BACKEND_URL } from "../const";
import { dispatchSDKError, setUserData } from "../reducers/app";

import { Separator, DeviceButton } from "../components/Shared";

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
    const theme = useTheme();

    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state, dispatch } = useContext(AppReducer);

    const [tokenList, setTokenList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUserData, setCurrentUserData] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const deleteUser = async () => {
        try {
            await apiService.user.deleteSelf();
            console.log("deleted self!");
            dispatch(setUserData(null));
        } catch (error) {
            dispatchSDKError(dispatch, error);
        } finally {
            setDeleteVisible(false);
        }
    };

    const onRefresh = useCallback(() => {
        async function prepare() {
            setRefreshing(true);
            setTokenList([]);

            try {
                const response = await apiService.device.list();
                setTokenList(response.devices);
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
            console.log("refreshing devices");
            onRefresh();
        }
    }, [route]);

    // load current user data
    useEffect(() => {
        async function prepare() {
            try {
                const currentUser = await apiService.user.getCurrentUser();
                console.log("currentUser", currentUser);
                setCurrentUserData(currentUser);
            } catch (error) {
                dispatchSDKError(dispatch, error);
            }
        }
        prepare();
    }, []);

    return (
        <SafeAreaView style={[themedStyles.container.base]}>
            <Portal>
                <Dialog visible={deleteVisible} onDismiss={() => setDeleteVisible(false)}>
                    <Dialog.Title>Delete Account?</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Your account and related data will be forever deleted!</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteVisible(false)}>Cancel</Button>
                        <Button onPress={deleteUser}>Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <FlatList
                ListHeaderComponent={() => (
                    <View>
                        <Text variant="displaySmall" style={{ marginBottom: 10 }}>
                            Account
                        </Text>
                        {apiService.getBackendUrl() != BACKEND_URL && (
                            <View style={{ position: "absolute", top: 10, right: 0 }}>
                                <IconButton
                                    icon="cog"
                                    mode="outlined"
                                    size={25}
                                    onPress={() => {
                                        Alert.alert(
                                            `Non-Default Backend`,
                                            `You are connected to a non-default backend:\n${apiService.getBackendUrl()}\n\nPlease logout to update the backend.`,
                                            [{ text: "OK" }],
                                        );
                                    }}
                                />
                            </View>
                        )}

                        {currentUserData && (
                            <Text variant="labelLarge">
                                Login Method:{" "}
                                {currentUserData.methods.map((method) => method.method).join(", ")}
                            </Text>
                        )}
                        <Text variant="labelLarge">User ID: {state.user.id}</Text>
                        <Text variant="labelLarge" style={{ marginBottom: 10 }}>
                            Registered: {state.user.createdAt}
                        </Text>

                        <View style={{ flexDirection: "row", alignContent: "center" }}>
                            <Button
                                onPress={async () => {
                                    dispatch(setUserData(null));
                                }}
                                icon="sign-out-alt"
                                mode="contained"
                                style={{ flex: 1, marginRight: 10 }}
                            >
                                Logout
                            </Button>
                            <Button
                                onPress={() => setDeleteVisible(true)}
                                icon="trash"
                                style={[
                                    {
                                        flex: 1,

                                        backgroundColor: theme.colors.onError,
                                    },
                                ]}
                                mode="contained-tonal"
                            >
                                Delete Account
                            </Button>
                        </View>
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    let isThisDevice = item.deviceKey == state.deviceKey;
                    return (
                        <DeviceButton
                            onPress={async () => {
                                navigation.navigate("ViewDevice", { deviceData: item });
                            }}
                            device={item}
                        />
                    );
                }}
            />
        </SafeAreaView>
    );
};

export default ConfigStack;
