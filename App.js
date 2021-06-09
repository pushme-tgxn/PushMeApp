import React, { useReducer, useEffect, useRef } from "react";

import { Platform, useColorScheme } from "react-native";

import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";

import { initialState, reducer } from "./reducers/app";
import {
  setAppReadyState,
  setUserData,
  setExpoPushToken,
  setNotification,
  setNotificationResponse,
} from "./reducers/app";

import AuthView from "./view/AuthView";
import AppTabView from "./view/AppTabView";

import { AppReducer } from "./const";

import apiService from "./service/api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

const App = () => {
  const scheme = useColorScheme();
  const [state, dispatch] = useReducer(reducer, initialState);

  const startState = useRef("Auth");

  const notificationListener = useRef();
  const responseListener = useRef();

  const registerNotificationCategories = async () => {
    await Notifications.setNotificationCategoryAsync("testMe", [
      {
        identifier: "one",
        buttonTitle: "Button One",
        options: {
          isDestructive: true,
          isAuthenticationRequired: false,
        },
      },
      {
        identifier: "two",
        buttonTitle: "Button Two",
        options: {
          isDestructive: false,
          isAuthenticationRequired: true,
        },
      },
      {
        identifier: "three",
        buttonTitle: "Three",
        textInput: {
          submitButtonTitle: "Three",
          placeholder: "Type Something",
        },
        options: {
          isAuthenticationRequired: false,
        },
      },
    ]);

    await Notifications.setNotificationCategoryAsync("buttonOpenApp", [
      {
        identifier: "openapp",
        buttonTitle: "Open App",
        options: {
          isDestructive: false,
          isAuthenticationRequired: true,
        },
      },
    ]);

    await Notifications.setNotificationCategoryAsync("buttonOpenLink", [
      {
        identifier: "openlink",
        buttonTitle: "Open Link",
        options: {
          isDestructive: false,
        },
      },
    ]);

    await Notifications.setNotificationCategoryAsync("textReplyMessage", [
      {
        identifier: "reply",
        buttonTitle: "Reply",
        textInput: {
          submitButtonTitle: "Send",
          placeholder: "Type a reply",
        },
        options: {
          isAuthenticationRequired: true,
        },
      },
    ]);
  };

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
      let loggedInUser;
      try {
        await SplashScreen.preventAutoHideAsync();

        await registerNotificationCategories();

        const token = await registerForPushNotificationsAsync();
        dispatch(setExpoPushToken(token));

        // attempt to load user
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData !== null) {
          console.log("loaded storedUserData", storedUserData);

          const userData = JSON.parse(storedUserData);

          // test access token
          apiService.setAccessToken(userData.token);
          const currentUser = await apiService.getCurrentUser();

          if (currentUser && currentUser.id == userData.id) {
            loggedInUser = userData;
          } else {
            console.log("not a valid token", currentUser, userData);
          }
        }
      } catch (e) {
        console.warn(e);
      } finally {
        if (loggedInUser) {
          dispatch(setUserData(loggedInUser));

          startState.current = "AppView";
        } else {
          startState.current = "Auth";
        }

        dispatch(setAppReadyState(true));
        await SplashScreen.hideAsync();
      }
    }

    prepare();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("addNotificationReceivedListener", notification);
        dispatch(setNotification(notification));
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("addNotificationResponseReceivedListener", response);
        dispatch(setNotificationResponse(response));

        Notifications.dismissNotificationAsync(
          response.notification.request.identifier
        );
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
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
      <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar />
        {state.user && <AppTabView />}
        {!state.user && <AuthView />}
      </NavigationContainer>
    </AppReducer.Provider>
  );
};

export default App;
