import { createContext } from "react";

import Constants from 'expo-constants';

export const PUSH_ENDPOINT = Constants.manifest.extra.backendURL;
console.log("PUSH_ENDPOINT", PUSH_ENDPOINT);

// export const GOOGLE_WEBCLIENT_ID = null;
export const GOOGLE_WEBCLIENT_ID = Constants.manifest.extra.googleClientId;
console.log("GOOGLE_WEBCLIENT_ID", GOOGLE_WEBCLIENT_ID);

// contexts
export const AppReducer = createContext(null);

export const NotificationCategories = {
  "button.yes_no": [
    {
      identifier: "yes",
      buttonTitle: "Yes",
      options: {
        isDestructive: true,
      },
    },
    {
      identifier: "no",
      buttonTitle: "No",
      options: {
        isDestructive: false,
      },
    },
  ],
  "button.approve_deny": [
    {
      identifier: "approve",
      buttonTitle: "Approve",
      options: {
        isDestructive: true,
      },
    },
    {
      identifier: "deny",
      buttonTitle: "Deny",
      options: {
        isDestructive: false,
      },
    },
  ],
  "button.acknowledge": [
    {
      identifier: "acknowledge",
      buttonTitle: "Acknowledge",
      options: {
        isDestructive: true,
      },
    },
  ],
  "button.open_link": [
    {
      identifier: "open_link",
      buttonTitle: "Open Link",
      options: {
        isDestructive: true,
      },
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
      options: {
        isAuthenticationRequired: false,
      },
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
      options: {
        isAuthenticationRequired: false,
      },
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
      options: {
        isAuthenticationRequired: false,
      },
    },
    {
      identifier: "deny",
      buttonTitle: "Deny",
      textInput: {
        submitButtonTitle: "Deny",
        placeholder: "Type a deny message...",
      },
      options: {
        isAuthenticationRequired: false,
      },
    },
  ],
};
