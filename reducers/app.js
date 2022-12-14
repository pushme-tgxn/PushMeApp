import AsyncStorage from "@react-native-async-storage/async-storage";

import apiService from "../service/api";

export function setDeviceKey(deviceKey) {
    console.info("setDeviceKey", deviceKey);
    return {
        type: "setDeviceKey",
        payload: {
            deviceKey,
        },
    };
}

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

export function setNativePushToken(pushToken) {
    console.info("setNativePushToken", pushToken);
    return {
        type: "setNativePushToken",
        payload: {
            pushToken,
        },
    };
}

export function setPushList(pushList) {
    console.info("setPushList", pushList);
    return {
        type: "setPushList",
        payload: {
            pushList,
        },
    };
}

export function setTopicList(topicList) {
    console.info("setTopicList", topicList);
    return {
        type: "setTopicList",
        payload: {
            topicList,
        },
    };
}

export function pushRecieved(push) {
    console.info("pushRecieved", JSON.stringify(push, null, 2));
    return {
        type: "pushRecieved",
        payload: {
            push,
        },
    };
}

export function setPushResponse(pushResponse) {
    console.info("setPushResponse", pushResponse);
    return {
        type: "setPushResponse",
        payload: {
            pushResponse,
        },
    };
}

export const initialState = {
    deviceKey: null,
    appIsReady: false,

    expoPushToken: null,
    nativePushToken: null,

    user: null,
    accessToken: null,

    pushList: {},
    topicList: [],

    notification: false,
    response: false,
};

import * as Device from "expo-device";
import { Platform } from "react-native";

export function reducer(state, action) {
    switch (action.type) {
        case "setDeviceKey":
            return { ...state, deviceKey: action.payload.deviceKey };

        case "setAppReadyState":
            return { ...state, appIsReady: action.payload.isAppReady };

        case "setUserData":
            if (action.payload.userData !== null) {
                AsyncStorage.setItem("userData", JSON.stringify(action.payload.userData));

                apiService.setAccessToken(action.payload.userData.token);
                console.log("setAccessToken", Device);

                const platform = Platform.OS === "android" ? "Android" : "iOS";
                const defaultDeviceNameFormat = `${platform} (${Device.deviceName})`;
                console.log("defaultDeviceNameFormat", defaultDeviceNameFormat);

                // create registration
                apiService.device.createDevice({
                    deviceKey: state.deviceKey,
                    name: defaultDeviceNameFormat,
                    token: state.expoPushToken,
                    nativeToken: state.nativePushToken,
                });

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
            return { ...state, expoPushToken: action.payload.pushToken.data };

        case "setNativePushToken":
            return { ...state, nativePushToken: action.payload.pushToken };

        case "setPushList":
            const pushList = {};
            action.payload.pushList.map((pushItem) => {
                pushList[pushItem.id] = pushItem;
            });
            return { ...state, pushList };

        case "setTopicList":
            const topicList = {};
            // action.payload.topicList.map((topic) => {
            //     topicList[topic.id] = topic;
            // });
            return { ...state, topicList: action.payload.topicList };

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
            try {
                const pushId = action.payload.push.request.content.data.pushId;
                const pushIdent = action.payload.push.request.content.data.pushIdent;
                const pushList = state.pushList;

                // update this push details
                pushList[pushId] = {
                    id: pushId,
                    pushIdent,
                    pushPayload: {
                        categoryId: action.payload.push.request.content.data.categoryIdentifier,
                        title: action.payload.push.request.content.title,
                        body: action.payload.push.request.content.body,
                        data: action.payload.push.request.content.data,
                    },
                };

                return { ...state, pushList };
            } catch (e) {
                console.error("cannot gather pushId 1", action.payload.push, e);
            }

            return state;

        case "setPushResponse":
            /**
      Object {
        "actionIdentifier": "expo.modules.notifications.actions.DEFAULT",
        "notification": Object {
          "date": 1630234055767,
          "request": Object {
            "content": Object {
              "autoDismiss": true,
              "badge": null,
              "body": "",
              "categoryIdentifier": "default",
              "data": Object {
                "pushId": 30,
              },
              "sound": "default",
              "sticky": false,
              "subtitle": null,
              "title": "",
            },
            "identifier": "0:1630234055770633%0ac519e6f9fd7ecd",
            "trigger": Object {
              "channelId": null,
              "remoteMessage": Object {
                "collapseKey": null,
                "data": Object {
                  "body": "{\"pushId\":30}",
                  "categoryId": "default",
                  "experienceId": "@tgxn/pushme",
                  "message": "",
                  "projectId": "dc94d550-9538-48ff-b051-43562cdcf34e",
                  "scopeKey": "@tgxn/pushme",
                  "title": "",
                },
                "from": "367315174693",
                "messageId": "0:1630234055770633%0ac519e6f9fd7ecd",
                "messageType": null,
                "notification": null,
                "originalPriority": 2,
                "priority": 2,
                "sentTime": 1630234055767,
                "to": null,
                "ttl": 2419200,
              },
              "type": "push",
            },
          },
        },
      }
       */
            try {
                const pushId = action.payload.pushResponse.notification.request.content.data.pushId;
                const pushIdent = action.payload.pushResponse.notification.request.content.data.pushIdent;

                apiService.push.respondToPush(pushIdent, action.payload.pushResponse);

                const pushList = state.pushList;

                // update this push details
                pushList[pushId] = {
                    ...pushList[pushId],
                    response: action.payload.pushResponse,
                };

                console.log("RESPONSE", pushList[pushId]);

                return { ...state, pushList };
            } catch (e) {
                console.error("cannot gather pushId 2", action.payload.push, e);
            }

            return state;

        default:
            throw new Error(`Unhandled action: ${action.type}`);
    }
}
