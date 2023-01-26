import React, { useReducer, useEffect, useRef } from "react";

import "expo-dev-client";

import { AppState, Platform, BackHandler, Alert, Linking, useColorScheme } from "react-native";

import * as Device from "expo-device";

import {
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

import PushMeSDK, { Consts } from "@pushme-tgxn/pushmesdk";

import { AppReducer, BACKEND_URL } from "./const";

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
    const appState = useRef(AppState.currentState);

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

    // register app for notifications (get tokens)
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

            const openAppSettings = () => {
                Linking.openSettings();
            };

            if (finalStatus !== "granted") {
                Alert.alert(
                    `Notification Permissions are not granted!`,
                    "Please enable notifications in the app settings.",
                    [
                        { text: "Exit App", onPress: () => BackHandler.exitApp() },
                        { text: "Open App Settings", onPress: openAppSettings },
                    ],
                );

                return [null, null];
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
        for (const index in Consts.PushDefinition) {
            const notificationCategory = Consts.PushDefinition[index];
            if (notificationCategory.actions) {
                console.debug("registering notification actions", index, notificationCategory);

                // `actions` docs: https://docs.expo.dev/versions/latest/sdk/notifications/#arguments-21
                await Notifications.setNotificationCategoryAsync(
                    index,
                    notificationCategory.actions.map((action) => {
                        return {
                            buttonTitle: action.title,
                            identifier: action.identifier,
                            options: action.options,
                            textInput: action.textInput,
                        };
                    }),
                );
            }
        }
    };

    const getAppPushTokens = async () => {
        // get application push tokens, and register notification categories
        try {
            let [expoToken, nativeToken] = await registerForPushNotificationsAsync();

            if (expoToken) {
                dispatch(setExpoPushToken(expoToken));
            }

            if (nativeToken) {
                dispatch(setNativePushToken(nativeToken));
            }

            await registerNotificationCategories();
        } catch (error) {
            console.error("error setting app up", error);
            // alert("error setting app up: " + error.toString());
        }
    };

    // listen for app state changes to detect foreground/background
    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                console.log("App has come to the foreground!");
                getAppPushTokens();
            }

            appState.current = nextAppState;
            console.log("AppState Changed", appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const initializeDeviceKey = async (state, dispatch) => {
        let deviceKey;
        try {
            if (state.deviceKey) {
                console.debug("using deviceKey from state", state.deviceKey);
                deviceKey = state.deviceKey;
            } else {
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
            }
        } catch (e) {
            console.warn(e);
            return null;
        }
    };

    const initializeBackendUrl = async () => {
        try {
            const serializedBackendUrl = await AsyncStorage.getItem("backendUrl");
            if (serializedBackendUrl !== null) {
                apiService.setBackendUrl(serializedBackendUrl);
            } else {
                apiService.setBackendUrl(BACKEND_URL);
            }
        } catch (e) {
            console.warn(e);
        }
    };

    const lastNotificationResponse = Notifications.useLastNotificationResponse();

    const responseRecieved = (response) => {
        console.log("addNotificationResponseReceivedListener", JSON.stringify(response, null, 4));

        // get the notification response data
        // TODO define this payload format
        const responseData = {
            pushIdent: response.notification.request.content.data.pushIdent,
            pushId: response.notification.request.content.data.pushId,
            actionIdentifier: response.actionIdentifier,
            categoryIdentifier: response.notification.request.content.categoryIdentifier,
            responseText: null,
        };

        // attach user text is defined
        if (response.userText) {
            responseData.responseText = response.userText;
        }

        const foundNotificationCategory = apiService.getNotificationCategory(responseData.categoryIdentifier);

        // send non-default responses if enabled for this type of notification
        if (response.actionIdentifier == Notifications.DEFAULT_ACTION_IDENTIFIER) {
            if (foundNotificationCategory && foundNotificationCategory.sendDefaultAction) {
                dispatch(setPushResponse(responseData));
            }
        } else {
            dispatch(setPushResponse(responseData));
        }

        // perform actions based on category
        if (
            responseData.categoryIdentifier == "button.open_link" &&
            response?.notification?.request?.content?.data?.linkUrl
        ) {
            console.log("open link", response.notification.request.content.data.linkUrl);
            Linking.openURL(response.notification.request.content.data.linkUrl);
        }

        // dismiss the notificaqtion when it's tapped
        Notifications.dismissNotificationAsync(response.notification.request.identifier);
    };

    useEffect(() => {
        console.log("action", Notifications);
        if (lastNotificationResponse) {
            responseRecieved(lastNotificationResponse);
        }
    }, [lastNotificationResponse]);

    useEffect(() => {
        async function prepare() {
            // generate or load a unique device key, and save it.
            await initializeDeviceKey(state, dispatch);

            // attempt to load backend URL
            await initializeBackendUrl();

            // attempt to load user
            let loggedInUser;
            try {
                const serializedUserData = await AsyncStorage.getItem("userData");
                if (serializedUserData !== null) {
                    const userData = JSON.parse(serializedUserData);
                    console.debug("loaded serializedUserData", userData.id, userData.token);

                    if (userData) {
                        // test access token
                        apiService.setAccessToken(userData.token);
                        const currentUser = await apiService.user.getCurrentUser();

                        console.debug("currentUser", currentUser, userData);

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
                // console.warn("error attempting to login user from saved token", e);
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

        // load user data, and app state
        prepare();

        // kick off application push tokens, and register notification categories on app start
        getAppPushTokens();

        // notification recieved, append to local array
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            console.log("addNotificationReceivedListener", notification);
            dispatch(pushRecieved(notification));
        });

        // notification response recieved
        // responseListener.current = Notifications.addNotificationResponseReceivedListener(responseRecieved);

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
