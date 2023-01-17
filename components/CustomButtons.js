import React, { useContext } from "react";
import { View, useColorScheme } from "react-native";
import { Button, Text, Surface, TouchableRipple, useTheme } from "react-native-paper";

import * as Clipboard from "expo-clipboard";

import Moment from "react-moment";

import { AppReducer } from "../const";
import MultiIcon from "./MultiIcon";

import styles from "../styles";
import apiService from "../service/api";

export const CopyTextButton = (props) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    return (
        <Button
            onPress={async () => {
                await Clipboard.setStringAsync(props.text);
                let message = "✅ Copied topic key to clipboard. 🎉";
                if (props.successMessage) {
                    message = props.successMessage;
                }

                showToast(message);
            }}
            icon={props.icon || "copy"}
            mode={props.mode || "outlined"}
            color={props.color || "green"}
            style={{ ...props.style, flex: 1 }}
        >
            {props.children}
        </Button>
    );
};

export const TwoLineButton = (props) => {
    const { title, subtitle, icon, onPress } = props;

    const theme = useTheme();
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    return (
        <Surface
            style={[{ marginBottom: 10, borderRadius: 5, backgroundColor: theme.colors.surfaceVariant }]}
            key={title}
        >
            <TouchableRipple style={[{ flex: 1, padding: 10 }]} onPress={onPress}>
                <View>
                    {icon && (
                        <MultiIcon
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                            }}
                            name={icon}
                            size={32}
                            color={colorScheme == "dark" ? "#222" : "white"}
                        />
                    )}
                    <Text style={{ paddingLeft: icon ? 40 : 10, padding: subtitle ? 0 : 7 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{title}</Text>
                        {subtitle && <Text style={{ height: 20 }}>{"\n"}</Text>}
                        {subtitle && <Text style={{ fontWeight: "italic", fontSize: 16 }}>{subtitle}</Text>}
                    </Text>
                </View>
            </TouchableRipple>
        </Surface>
    );
};

export const PushListButton = (props) => {
    const { push, onPress } = props;

    const theme = useTheme();

    const getIconName = (iconSet) => {
        switch (iconSet) {
            case "simple.push":
                return "mi.circle-notifications";
            case "button.approve_deny":
                return "mi.verified-user";
            case "button.yes_no":
                return "fa5.check-double";
            case "button.acknowledge":
                return "mi.check-circle";
            case "button.open_link":
                return "mi.link";
            case "input.reply":
                return "mc.reply";
            case "input.submit":
                return "mi.send";
            default:
                return "mc.alert-box";
        }
    };

    const getNotificationColor = (categoryId, actionId) => {
        const actionColorMap = {
            "simple.push": "green",
            "button.approve_deny": {
                approve: "green",
                deny: "red",
            },
            "button.yes_no": {
                yes: "green",
                no: "red",
            },
            "button.acknowledge": "green",
            "button.open_link": "green",
            "input.reply": "green",
            "input.submit": "green",
        };

        // none set
        if (!actionColorMap[categoryId]) {
            return theme.colors.onSurfaceVariant;
        }

        if (typeof actionColorMap[categoryId] == "string") {
            return actionColorMap[categoryId];
        }

        return actionColorMap[categoryId][actionId];
    };

    let responseColor = theme.colors.onSurfaceVariant;
    let responseData = false;
    if (push.firstValidResponse) {
        const { categoryIdentifier, actionIdentifier } = push.firstValidResponse;

        responseColor = getNotificationColor(categoryIdentifier, actionIdentifier);
        responseData = apiService.getNotificationAction(categoryIdentifier, actionIdentifier);
    }

    if (!push.pushPayload) {
        // console.log("PushListButton", push);
        return null;
    }

    let foundCategory = apiService.getNotificationCategory(push.pushPayload.categoryId);

    if (!foundCategory) {
        foundCategory = {
            title: "Unknown",
            description: "Unknown",
            identifier: "unknown",
            actions: [],
        };
    }

    let statusIcon = (
        <Text style={{ paddingLeft: 5, textAlignVertical: "center" }}>
            <MultiIcon name={"fa5.check"} size={14} color={"grey"} />
        </Text>
    );

    if (push?.pushPayload?.data?.sendReceipt) {
        statusIcon = (
            <Text style={{ paddingLeft: 5, textAlignVertical: "center" }}>
                <MultiIcon name={"fa5.check-double"} size={14} color={"grey"} />
            </Text>
        );
        if (push.pushReceipt) {
            statusIcon = (
                <Text style={{ paddingLeft: 5, textAlignVertical: "center" }}>
                    <MultiIcon name={"fa5.check-double"} size={14} color={"green"} />
                </Text>
            );
        }
    }

    return (
        <Surface
            style={[{ marginBottom: 10, borderRadius: 5, backgroundColor: theme.colors.surfaceVariant }]}
            key={push.id}
            elevation={5}
        >
            <TouchableRipple style={[{ padding: 10 }]} onPress={onPress}>
                <View>
                    <MultiIcon
                        style={{
                            position: "absolute",
                            left: 0,
                            top: push.firstValidResponse ? 10 : 0,
                        }}
                        name={getIconName(push.pushPayload.categoryId)}
                        size={32}
                        color={responseColor}
                    />

                    <View style={{ padding: 0, paddingLeft: 40, display: "flex", flexDirection: "column" }}>
                        <View
                            style={{
                                fontSize: 12,
                                flex: 1,
                                flexDirection: "row",
                                width: "100%",
                                display: "flex",
                            }}
                        >
                            <Text style={{ flex: 1, flexGrow: 6 }}>{foundCategory.title}</Text>
                            <Moment
                                element={Text}
                                interval={1000}
                                style={{
                                    fontStyle: "italic",
                                    flex: 6,
                                    alignSelf: "stretch",
                                    textAlign: "right",

                                    justifyContent: "flex-end",
                                    // marginLeft: "auto",
                                }}
                                fromNow
                            >
                                {push.createdAt}
                            </Moment>
                            {statusIcon}
                        </View>
                        <Text
                            style={{ fontWeight: "bold", fontSize: 18, flex: 1 }}
                        >{`${push.pushPayload.title}`}</Text>

                        {push.firstValidResponse && (
                            <Text style={{ fontSize: 16 }}>
                                {`You Responded: ${responseData.title}`}
                                {push.firstValidResponse.responseText ? (
                                    <Text style={{ fontWeight: "bold" }}>
                                        {` "${push.firstValidResponse.responseText}"`}
                                    </Text>
                                ) : null}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableRipple>
        </Surface>
    );
};

export const DeviceButton = (props) => {
    const { device, onPress } = props;

    const { state } = useContext(AppReducer);

    const theme = useTheme();

    let buttonColor = theme.colors.surfaceVariant;

    let isThisDevice = device.deviceKey == state.deviceKey;
    if (isThisDevice) {
        buttonColor = theme.colors.primary;
    }

    const buttonProps = {
        color: theme.colors.onSurfaceVariant,
        size: 32,
        style: {
            position: "absolute",
            left: 0,
            top: 0,
        },
    };

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case "android":
                return "fa.android";
            case "ios":
                return "fa.apple";
            case "web":
                return "mc.web";

            default:
                return "fa.question-circle-o";
        }
    };

    return (
        <Surface
            style={[{ marginBottom: 10, borderRadius: 5, backgroundColor: buttonColor }]}
            key={device.id}
        >
            <TouchableRipple style={[{ flex: 1, padding: 10 }]} onPress={onPress}>
                <View>
                    <MultiIcon name={getPlatformIcon(device.type)} {...buttonProps} />
                    <View style={{ paddingLeft: 41, padding: isThisDevice ? 0 : 7 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                            {device.name ? device.name : "Unnamed Device"}
                        </Text>
                        {isThisDevice && (
                            <Text style={{ fontStyle: "italic", fontSize: 16 }}>
                                {isThisDevice && "This Device"}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableRipple>
        </Surface>
    );
};
