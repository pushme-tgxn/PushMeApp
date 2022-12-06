import { createContext } from "react";

import Constants from "expo-constants";

export const BACKEND_URL = Constants.expoConfig.extra.BACKEND_URL;
console.log("BACKEND_URL", BACKEND_URL);

// contexts
export const AppReducer = createContext(null);

export const NotificationCategories = {
    "button.yes_no": [
        {
            identifier: "yes",
            buttonTitle: "Yes",
            isDestructive: true,
            // options: {},
        },
        {
            identifier: "no",
            buttonTitle: "No",
            isDestructive: false,
            // options: {},
        },
    ],
    "button.approve_deny": [
        {
            identifier: "approve",
            buttonTitle: "Approve",
            isDestructive: true,
            // options: {},
        },
        {
            identifier: "deny",
            buttonTitle: "Deny",
            isDestructive: false,
            // options: {},
        },
    ],
    "button.acknowledge": [
        {
            identifier: "acknowledge",
            buttonTitle: "Acknowledge",
            isDestructive: false,
            // options: {},
        },
    ],
    "button.open_link": [
        {
            identifier: "open_link",
            buttonTitle: "Open Link",
            isDestructive: false,
            // options: {},
        },
    ],
    "input.submit": [
        {
            identifier: "submit",
            buttonTitle: "Submit",
            textInput: {
                submitButtonTitle: "Submit",
                placeholder: "Type a message...",
            },
            isAuthenticationRequired: false,
            // options: {},
        },
    ],
    "input.reply": [
        {
            identifier: "reply",
            buttonTitle: "Reply",
            textInput: {
                submitButtonTitle: "Reply",
                placeholder: "Type a reply...",
            },
            isAuthenticationRequired: false,
            // options: {},
        },
    ],
    "input.approve_deny": [
        {
            identifier: "approve",
            buttonTitle: "Approve",
            textInput: {
                submitButtonTitle: "Approve",
                placeholder: "Type an approval message...",
            },
            isAuthenticationRequired: false,
            // options: {},
        },
        {
            identifier: "deny",
            buttonTitle: "Deny",
            textInput: {
                submitButtonTitle: "Deny",
                placeholder: "Type a deny message...",
            },
            isAuthenticationRequired: false,
            // options: {},
        },
    ],
};
