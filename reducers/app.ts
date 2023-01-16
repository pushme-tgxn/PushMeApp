import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Errors } from "@pushme-tgxn/pushmesdk";

import { showToast } from "../components/Shared";

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
    // console.info("setPushList", pushList);
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
    // console.info("pushRecieved", JSON.stringify(push, null, 2));
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
            ...pushResponse,
        },
    };
}

// action that dispatches
export function dispatchSDKError(dispatch, sdkError) {
    console.info("dispatchSDKError", sdkError);

    if (sdkError instanceof Errors.UnauthorizedError) {
        console.debug("UnauthorizedError", sdkError.message);
        showToast("❌ Unauthorized, please login again! 🔒");

        // log user out
        dispatch({
            type: "setUserData",
            payload: {
                userData: null,
            },
        });
    } else if (sdkError instanceof Errors.ServerError) {
        console.debug("ServerError", sdkError.message);
        showToast("❌ Server error! 😭");
    } else {
        console.debug("APIError", sdkError.message);
        showToast("❌ API network request failed! 😭");
    }
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

                // create registration only if we have an expo token
                // TODO this should also update the device if the keys have changed
                // currently it just tries to create the device every time
                if (state.expoPushToken) {
                    const platform = Platform.OS === "android" ? "Android" : "iOS";
                    const defaultDeviceNameFormat = `${platform} (${Device.deviceName})`;
                    console.log("defaultDeviceNameFormat", defaultDeviceNameFormat);

                    apiService.device.create({
                        deviceKey: state.deviceKey,
                        name: defaultDeviceNameFormat,
                        token: state.expoPushToken,
                        nativeToken: state.nativePushToken,
                        type: Platform.OS,
                    });
                }

                return {
                    ...state,
                    user: action.payload.userData,
                    accessToken: action.payload.userData.token,
                };
            } else {
                AsyncStorage.removeItem("userData");
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
            console.log("setPushList", action.payload.pushList);
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

        // push is recieved from addNotificationReceivedListener
        case "pushRecieved":
            try {
                const { content } = action.payload.push.request;

                const pushList = state.pushList;

                // extract data values added by the server
                const { pushId, pushIdent } = content.data;
                console.log("pushRecieved", content);

                // send push receipt to the backend if requested
                if (content.data.sendReceipt) {
                    console.debug("sending push receipt", pushIdent);
                    apiService._callApi(`/push/${pushIdent}/receipt`, "POST", action.payload.push);
                    // sdk 1.10.2+
                    // apiService.sendReceipt(pushIdent, action.payload.push);
                }

                // update this push details locally
                pushList[pushId] = {
                    id: pushId,
                    pushIdent,
                    createdAt: moment(action.payload.push.date).toISOString(),
                    pushPayload: {
                        categoryId: content.categoryIdentifier,
                        title: content.title,
                        body: content.body,
                        data: content.data,
                    },
                };

                return { ...state, pushList };
            } catch (e) {
                console.error("cannot gather pushId 1", action.payload.push, e);
            }

            return state;

        // user selected a response to the push
        case "setPushResponse":
            try {
                // send push response to the backend
                apiService.push.respondToPush(action.payload.pushIdent, action.payload);

                const pushList = state.pushList;

                // console.log("RESPONSE", action.payload);

                const  parsedResponse: PushResponse = {
                    ...action.payload,
                };

                // update this push details
                pushList[action.payload.pushId] = <PushResponses>{
                    ...pushList[action.payload.pushId],
                    firstValidResponse: parsedResponse,
                    serviceResponses: [parsedResponse],
                };

                // console.log("RESPONSE", pushList[action.payload.pushId]);

                return { ...state, pushList };
            } catch (e) {
                console.error("cannot gather pushId 2", action.payload, e);
            }

            return state;

        default:
            throw new Error(`Unhandled action: ${action.type}`);
    }
}
