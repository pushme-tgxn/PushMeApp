import Constants from "expo-constants";
import { createContext } from "react";

// load backend url from expo configuration file
export const BACKEND_URL = Constants.expoConfig.extra.BACKEND_URL;
console.log("BACKEND_URL", BACKEND_URL);

// setup application state reducer
export const AppReducer = createContext(null);
