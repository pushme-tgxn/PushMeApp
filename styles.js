import { StyleSheet, StatusBar, Platform } from "react-native";

const baseColors = {
    textColor: "#000",
    primaryColor: "#a845ff",
    backgroundColor: "#fff",
};

const baseStyles = {
    separator: {
        marginVertical: 8,
        margin: 0,
        marginTop: 15,
        marginBottom: 15,
        borderBottomColor: "#737373",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },

    fab: {
        position: "absolute",
        backgroundColor: "#a845ff",
        margin: 16,
        right: 5,
        bottom: 5,
        borderRadius: 20,
    },

    fields: {
        inputStyle: {
            flexGrow: 1,
            marginBottom: 10,
            height: 40,
        },
    },

    dropdown: {
        containerView: {
            height: 40,
            margin: 10,
        },

        inputStyle: {
            flexGrow: 1,
            color: baseColors.textColor,
            borderColor: baseColors.textColor,
            margin: 5,
            height: 40,
            borderWidth: 1,
            borderRadius: 2,
            paddingHorizontal: 5,
        },
    },

    container: {
        base: {
            // base container for top-level screens
            flex: 1,
            marginTop: 10,
            // shadowOffset: { width: 0, height: 0 },
            paddingHorizontal: 10,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
        pane: {
            // container for tab panes
            flex: 1,
            paddingTop: 15,
            paddingHorizontal: 16,
        },
        center: {
            // center pane for login screen
            flex: 1,
            paddingHorizontal: 10,
            justifyContent: "center",
            alignContent: "center",
        },
    },

    button: {
        iconRight: {
            flexDirection: "row-reverse",
        },
        // listButton: {
        //     marginBottom: 10,
        // },
        // bigButton: {
        //     paddingVertical: 8,
        // },
    },

    text: {
        redCenter: {
            color: "red",
            textAlign: "center",
        },
    },

    appBar: {
        // elevated appbar is good for now
        // backgroundColor: "#a845ff",
    },

    modal: {
        background: {
            flex: 1,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "space-around",
            backgroundColor: "#22222240",
        },
        activityIndicatorWrapper: {
            backgroundColor: "#FFFFFF",
            height: 100,
            width: 100,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
        },
        activityIndicator: {
            alignItems: "center",
            height: 80,
        },
    },
};

const darkStyles = {
    separator: {
        marginVertical: 8,
        borderBottomColor: "#737373",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
};

export default (colorScheme) => {
    if (colorScheme === "dark") {
        const mergedStyles = {};
        for (const styleName in baseStyles) {
            mergedStyles[styleName] = {
                ...baseStyles[styleName],
                ...darkStyles[styleName],
            };
        }
        return StyleSheet.create(mergedStyles);
    }
    return StyleSheet.create(baseStyles);
};
