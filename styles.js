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
        right: 0,
        bottom: 0,
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
            flex: 1,
            paddingHorizontal: 16,
            marginTop: 10,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
        center: {
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
        },
    },

    button: {
        iconRight: {
            flexDirection: "row-reverse",
        },
        listButton: {
            marginBottom: 10,
        },
        bigButton: {
            paddingTop: 8,
            paddingBottom: 8,
        },
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

    // authScreenContainer: {
    //     flex: 1,
    //     justifyContent: "center",
    //     alignContent: "center",
    // },

    // containers
    screenContainer: {
        flex: 1,
        alignContent: "center",
        color: baseColors.textColor,
        paddingHorizontal: 16,
        marginTop: 10,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    paneContainer: {
        flex: 1,
        alignContent: "center",
        color: baseColors.textColor,
        paddingHorizontal: 16,
    },
    // authScreenContainer: {
    //     flex: 1,
    //     justifyContent: "center",
    //     alignContent: "center",
    // },

    // content
    baseText: {
        color: baseColors.textColor,
    },

    headerText: {
        color: baseColors.textColor,
        fontSize: 30,
        margin: 0,
        marginTop: 10,
        height: 44,
    },

    // button: {
    //     padding: 10,
    //     margin: 5,
    //     borderRadius: 2,
    //     backgroundColor: baseColors.primaryColor,
    // },
    // buttonText: {
    //     fontSize: 20,
    //     color: "#fff",
    // },

    listItem: {
        padding: 10,
        marginBottom: 5,
        fontSize: 18,
        height: 44,
    },

    inputContainerView: {
        flexDirection: "row",
        height: 40,
        margin: 10,
    },

    modalBackground: {
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
    pushModalWrapper: {
        backgroundColor: "#fff",
        margin: 25,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
    },
    activityIndicator: {
        alignItems: "center",
        height: 80,
    },

    buttonStyle: {
        backgroundColor: "#7DE24E",
        borderWidth: 0,
        color: baseColors.textColor,
        borderColor: "#7DE24E",
        height: 40,
        alignItems: "center",
        borderRadius: 30,
        marginHorizontal: 35,
        marginVertical: 20,
    },
    buttonTextStyle: {
        color: "#FFFFFF",
        paddingVertical: 10,
        fontSize: 16,
    },

    actionTextStyle: {
        color: baseColors.textColor,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 14,
        alignSelf: "center",
        padding: 10,
    },

    successTextStyle: {
        color: baseColors.textColor,
        textAlign: "center",
        fontSize: 18,
        padding: 30,
    },

    // FAB
    // touchableOpacityStyle: {
    //     position: "absolute",
    //     width: 50,
    //     height: 50,
    //     alignItems: "center",
    //     justifyContent: "center",
    //     right: 30,
    //     bottom: 30,
    // },
    // floatingButtonStyle: {
    //     resizeMode: "contain",
    //     width: 50,
    //     height: 50,
    //     backgroundColor: "purple",
    // },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
};

const darkColors = {
    textColor: "#fff",
    backgroundColor: "#000",
};
const darkStyles = {
    // screenContainer: {
    //     flex: 1,
    //     color: darkColors.textColor,
    // },

    // baseText: {
    //     color: darkColors.textColor,
    // },
    // headerText: {
    //     color: darkColors.textColor,
    // },
    // actionTextStyle: {
    //     color: darkColors.textColor,
    // },
    // pushModalWrapper: {
    //     backgroundColor: darkColors.backgroundColor,
    //     borderWidth: 1,
    //     borderColor: darkColors.textColor,
    // },
    // inputStyle: {
    //     color: darkColors.textColor,
    //     borderColor: darkColors.textColor,
    // },

    listItem: {
        color: darkColors.textColor,
    },
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
