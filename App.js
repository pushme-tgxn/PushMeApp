import React, { useReducer, useEffect, useRef } from "react";

import "expo-dev-client";

import { Platform, useColorScheme } from "react-native";

import * as Device from "expo-device";
import {
    // DefaultTheme as PaperDefaultTheme,
    Provider as PaperProvider,
    MD3LightTheme as DefaultLightTheme,
    MD3DarkTheme as DefaultDarkTheme,
} from "react-native-paper";

import { FontAwesome5 } from "@expo/vector-icons";

import { RootSiblingParent } from "react-native-root-siblings";

import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";

import uuid from "react-native-uuid";

import { NavigationContainer } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";

import { initialState, reducer } from "./reducers/app";

import {
    setDeviceKey,
    setAppReadyState,
    setUserData,
    setExpoPushToken,
    setNativePushToken,
    pushRecieved,
    setPushResponse,
} from "./reducers/app";

import AuthView from "./views/AuthView";
import AppTabView from "./views/AppTabView";

import NotificationPopup from "./components/NotificationPopup";

import { AppReducer, NotificationCategories } from "./const";

import apiService from "./service/api";

// background notificaiton listener
const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
    console.debug("Received a notification in the background!", data);
    // Do something with the notification data
});
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

SplashScreen.preventAutoHideAsync();

const App = () => {
    // DefaultTheme;
    const scheme = useColorScheme();
    const [state, dispatch] = useReducer(reducer, initialState);

    let theme = DefaultLightTheme;
    if (scheme === "dark") {
        theme = DefaultDarkTheme;
    }

    // adpations
    theme = {
        ...theme,
        mode: "exact",
        backdrop: true,
        roundness: 1,
        colors: {
            ...theme.colors,
            primary: "#a845ff",
            accent: "#933ce0",
        },
    };

    const startState = useRef("Auth");

    const notificationListener = useRef();
    const responseListener = useRef();

    // register app for notifications
    const registerForPushNotificationsAsync = async () => {
        let token, nativeToken;

        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                alert("Failed to get push token for push notification!");
                return;
            }

            token = await Notifications.getExpoPushTokenAsync();
            nativeToken = await Notifications.getDevicePushTokenAsync();
        } else {
            alert("Must use physical device for Push Notifications");
        }

        return [token, nativeToken];
    };

    // register notification categories from client-side
    const registerNotificationCategories = async () => {
        for (const index in NotificationCategories) {
            await Notifications.setNotificationCategoryAsync(index, NotificationCategories[index]);
        }
    };

    useEffect(() => {
        async function prepare() {
            let deviceKey, loggedInUser;

            // generate or load a unique device key, and save it.
            try {
                const existingDeviceKey = await AsyncStorage.getItem("deviceKey");
                if (existingDeviceKey !== null) {
                    deviceKey = existingDeviceKey;
                    console.debug("loaded deviceKey", deviceKey);
                } else {
                    deviceKey = uuid.v4();
                    await AsyncStorage.setItem("deviceKey", deviceKey);
                    console.debug("generated deviceKey", deviceKey);
                }
                dispatch(setDeviceKey(deviceKey));
            } catch (e) {
                console.warn(e);
            }

            // get application push tokens, and register notification categories
            try {
                let [expoToken, nativeToken] = await registerForPushNotificationsAsync();
                dispatch(setExpoPushToken(expoToken));
                dispatch(setNativePushToken(nativeToken));

                await registerNotificationCategories();
            } catch (error) {
                console.error("error setting app up", error);
                alert("error setting app up: " + error.toString());
            }

            // attempt to load backend URL
            try {
                const serializedBackendUrl = await AsyncStorage.getItem("backendUrl");
                if (serializedBackendUrl !== null) {
                    apiService.setBackendUrl(serializedBackendUrl);
                }
            } catch (e) {
                console.warn(e);
            }

            // attempt to load user
            try {
                const serializedUserData = await AsyncStorage.getItem("userData");
                if (serializedUserData !== null) {
                    const userData = JSON.parse(serializedUserData);
                    console.debug("loaded serializedUserData", userData.id);

                    if (userData) {
                        apiService.setAccessToken(userData.token);
                        const currentUser = await apiService.user.getCurrentUser();
                        if (currentUser && currentUser.user.id == userData.id) {
                            loggedInUser = userData;
                        } else {
                            console.log("not a valid token", currentUser, userData);
                        }
                    } else {
                        console.log("no valid userData", userData);
                    }
                }
            } catch (e) {
                console.warn(e);
            } finally {
                if (loggedInUser) {
                    // only if a valid token was found

                    dispatch(setUserData(loggedInUser));

                    startState.current = "AppView";
                } else {
                    startState.current = "Auth";
                }
                dispatch(setAppReadyState(true));
            }

            await SplashScreen.hideAsync();
        }

        prepare();

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            console.log("addNotificationReceivedListener", notification);
            dispatch(pushRecieved(notification));

            // Notifications.dismissNotificationAsync(notification.request.identifier);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("addNotificationResponseReceivedListener", response);

            const responseData = {
                pushIdent: response.notification.request.content.data.pushIdent,
                pushId: response.notification.request.content.data.pushId,
                actionIdentifier: response.actionIdentifier,
                categoryIdentifier: response.notification.request.content.categoryIdentifier,
            };

            dispatch(setPushResponse(responseData));

            Notifications.dismissNotificationAsync(response.notification.request.identifier);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    if (!state.appIsReady) {
        return null;
    }

    return (
        <AppReducer.Provider
            value={{
                state,
                dispatch,
            }}
        >
            <RootSiblingParent>
                <PaperProvider
                    settings={{
                        icon: (props) => <FontAwesome5 style={{ textAlign: "center" }} {...props} />,
                    }}
                    theme={theme}
                >
                    <NavigationContainer theme={theme}>
                        <NotificationPopup />
                        <StatusBar
                            backgroundColor={theme.colors.background}
                            style={scheme === "dark" ? "light" : "dark"}
                        />
                        {state.user && <AppTabView />}
                        {!state.user && <AuthView />}
                    </NavigationContainer>
                </PaperProvider>
            </RootSiblingParent>
        </AppReducer.Provider>
    );
};

export default App;
