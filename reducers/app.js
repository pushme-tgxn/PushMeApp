import AsyncStorage from "@react-native-async-storage/async-storage";

import apiService from "../service/backend";

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
    console.info("setPushList", pushList);
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
            if (action.payload.userData !== null) {
                AsyncStorage.setItem("userData", JSON.stringify(action.payload.userData));

                apiService.setAccessToken(action.payload.userData.token);
                apiService.upsertTokenRegistration({
                    token: state.expoPushToken,
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
            try {
                const pushId = action.payload.push.request.content.data.pushId;
                const pushList = state.pushList;

                // update this push details
                pushList[pushId] = {
                    id: pushId,
                    pushPayload: {
                        categoryId: action.payload.push.request.content.data.categoryIdentifier,
                        title: action.payload.push.request.content.title,
                        body: action.payload.push.request.content.body,
                        data: action.payload.push.request.content.data,
                    },
                };

                return { ...state, pushList };
            } catch (e) {
                console.error("cannot gather pushId", action.payload.push, e);
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

                apiService.respondToPush(pushId, action.payload.pushResponse);

                const pushList = state.pushList;

                // update this push details
                pushList[pushId] = {
                    ...pushList[pushId],
                    response: action.payload.pushResponse,
                };

                console.log("RESPONSE", pushList[pushId]);

                return { ...state, pushList };
            } catch (e) {
                console.error("cannot gather pushId", action.payload.push, e);
            }

            return state;

        default:
            throw new Error(`Unhandled action: ${action.type}`);
    }
}
