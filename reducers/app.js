import AsyncStorage from "@react-native-async-storage/async-storage";

export function setAppReadyState(isAppReady) {
  console.info("setAppReadyState", isAppReady);
  return {
    type: "setAppReadyState",
    payload: {
      isAppReady,
    },
  };
}

export function setUserData(userData) {
  console.info("setUserData", userData);
  return {
    type: "setUserData",
    payload: {
      userData,
    },
  };
}

export function setExpoPushToken(pushToken) {
  console.info("setExpoPushToken", pushToken);
  return {
    type: "setExpoPushToken",
    payload: {
      pushToken,
    },
  };
}

export function setNotification(notification) {
  console.info("setNotification", notification);
  return {
    type: "setNotification",
    payload: {
      notification,
    },
  };
}

export function setNotificationResponse(response) {
  console.info("setNotificationResponse", response);
  return {
    type: "setNotificationResponse",
    payload: {
      response,
    },
  };
}

export const initialState = {
  appIsReady: false,
  expoPushToken: null,

  user: null,
  accessToken: null,

  notification: false,
  response: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case "setAppReadyState":
      return { ...state, appIsReady: action.payload.isAppReady };

    case "setUserData":
      AsyncStorage.setItem("userData", JSON.stringify(action.payload.userData));

      if (action.payload.userData !== null) {
        return {
          ...state,
          user: action.payload.userData,
          accessToken: action.payload.userData.token,
        };
      } else {
        return {
          ...state,
          user: null,
          accessToken: null,
        };
      }

    case "setExpoPushToken":
      return { ...state, expoPushToken: action.payload.pushToken };

    case "setNotification":
      return { ...state, notification: action.payload.notification };

    case "setNotificationResponse":
      return { ...state, response: action.payload.response };

    default:
      throw new Error(`Unhandled action: ${action.type}`);
  }
}
