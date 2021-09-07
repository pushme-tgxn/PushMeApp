import React, { useReducer, useEffect, useRef } from "react";

import { Platform, useColorScheme } from "react-native";

import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";

import { initialState, reducer } from "./reducers/app";

import {
  setAppReadyState,
  setUserData,
  setExpoPushToken,
  pushRecieved,
  setPushResponse,
} from "./reducers/app";

import AuthView from "./views/AuthView";
import AppTabView from "./views/AppTabView";

import { AppReducer, NotificationCategories } from "./const";

import apiService from "./service/backend";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("Received a notification in the background!");
    // Do something with the notification data
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const scheme = useColorScheme();
  const [state, dispatch] = useReducer(reducer, initialState);

  const startState = useRef("Auth");

  const notificationListener = useRef();
  const responseListener = useRef();

  // register notification categories from client-side
  const registerNotificationCategories = async () => {
    for (const index in NotificationCategories) {
      console.log(
        "add notification category",
        index,
        NotificationCategories[index]
      );
      await Notifications.setNotificationCategoryAsync(
        index,
        NotificationCategories[index]
      );
    }
  };

  // register app for notifications
  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  useEffect(() => {
    async function prepare() {
      let loggedInUser, expoToken;

      try {
        await SplashScreen.preventAutoHideAsync();

        await registerNotificationCategories();

        expoToken = await registerForPushNotificationsAsync();
        dispatch(setExpoPushToken(expoToken));

        notificationListener.current =
          Notifications.addNotificationReceivedListener((notification) => {
            console.log("addNotificationReceivedListener", notification);
            dispatch(pushRecieved(notification));
          });

        responseListener.current =
          Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("addNotificationResponseReceivedListener", response);
            dispatch(setPushResponse(response));

            Notifications.dismissNotificationAsync(
              response.notification.request.identifier
            );
          });

        return () => {
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
        };
      } catch (error) {
        console.log("error setting app up", error);
        alert("error setting app up: " + error.toString());
      }

      // attempt to load user
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData !== null) {
          console.log("loaded storedUserData", storedUserData);

          const userData = JSON.parse(storedUserData);

          apiService.setAccessToken(userData.token);
          const currentUser = await apiService.getCurrentUser();
          if (currentUser && currentUser.user.id == userData.id) {
            loggedInUser = userData;
          } else {
            console.log("not a valid token", currentUser, userData);
          }
        }
      } catch (e) {
        console.warn(e);
      } finally {
        if (loggedInUser) {
          // only if a valid token was found

          dispatch(setUserData(loggedInUser));

          apiService.setAccessToken(userData.token);
          apiService.upsertTokenRegistration({
            token: expoToken,
          });

          startState.current = "AppView";
        } else {
          startState.current = "Auth";
        }

        dispatch(setAppReadyState(true));
      }
      await SplashScreen.hideAsync();
    }

    prepare();
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
      <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar />
        {state.user && <AppTabView />}
        {!state.user && <AuthView />}
      </NavigationContainer>
    </AppReducer.Provider>
  );
};

export default App;
