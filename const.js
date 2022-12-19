import { createContext } from "react";

import Constants from "expo-constants";

import { NotificationDefinitions } from "@pushme-tgxn/pushmesdk";

export const BACKEND_URL = Constants.expoConfig.extra.BACKEND_URL;
console.log("BACKEND_URL", BACKEND_URL);

// contexts
export const AppReducer = createContext(null);

// `actions` docs: https://docs.expo.dev/versions/latest/sdk/notifications/#arguments-21
export const NotificationDefinitions = NotificationDefinitions;
