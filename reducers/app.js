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

export function setPushList(pushList) {
  // console.info("setPushList", pushList);
  return {
    type: "setPushList",
    payload: {
      pushList,
    },
  };
}

export function pushRecieved(push) {
  console.info("pushRecieved", push);
  return {
    type: "pushRecieved",
    payload: {
      push,
    },
  };
}

export function setPushResponse(response) {
  console.info("setPushResponse", response);
  return {
    type: "setPushResponse",
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

  pushList: {},

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

    case "setPushList":
      const pushList = {};
      action.payload.pushList.map((pushItem) => {
        pushList[pushItem.id] = pushItem;
      });
      return { ...state, pushList };

    case "pushRecieved":
      /**
      Object {
        "date": 1630230256230,
        "request": Object {
          "content": Object {
            "autoDismiss": true,
            "badge": null,
            "body": "",
            "categoryIdentifier": "default",
            "data": Object {
              "pushId": 19,
            },
            "sound": "default",
            "sticky": false,
            "subtitle": null,
            "title": "",
          },
          "identifier": "0:1630230256233655%0ac519e6f9fd7ecd",
          "trigger": Object {
            "channelId": null,
            "remoteMessage": Object {
              "collapseKey": null,
              "data": Object {
                "body": "{\"pushId\":19}",
                "categoryId": "default",
                "experienceId": "@tgxn/pushme",
                "message": "",
                "projectId": "dc94d550-9538-48ff-b051-43562cdcf34e",
                "scopeKey": "@tgxn/pushme",
                "title": "",
              },
              "from": "367315174693",
              "messageId": "0:1630230256233655%0ac519e6f9fd7ecd",
              "messageType": null,
              "notification": null,
              "originalPriority": 2,
              "priority": 2,
              "sentTime": 1630230256230,
              "to": null,
              "ttl": 2419200,
            },
            "type": "push",
          },
        },
      }
       */

      // all pushes should have id
      let pushId = false;
      try {
        pushId = action.payload.push.request.content.data.pushId;
      } catch (e) {
        console.error("cannot gather pushId", action.payload.push, e);
      }
      if (pushId) {
        const pushList = state.pushList;

        // update this push details
        pushList[pushId] = {
          id: pushId,
          pushPayload: {
            categoryId:
              action.payload.push.request.content.data.categoryIdentifier,
            title: action.payload.push.request.content.title,
            body: action.payload.push.request.content.body,
            data: action.payload.push.request.content.data,
          },
        };

        return { ...state, pushList };
      }

      return state;

    case "setPushResponse":
      return { ...state, response: action.payload.response };

    default:
      throw new Error(`Unhandled action: ${action.type}`);
  }
}
