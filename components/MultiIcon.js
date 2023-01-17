import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// https://oblador.github.io/react-native-vector-icons/
const MultiIcon = ({ name, ...props }) => {
    const iconSet = name.split(".")[0];
    const iconName = name.split(".")[1];

    switch (iconSet) {
        case "ion":
            return <Ionicons name={iconName} {...props} />;
        case "fe":
            return <Feather name={iconName} {...props} />;
        case "fa":
            if (props.style.paddingLeft) props.style.paddingLeft = props.style.paddingLeft + 4;
            return (
                <FontAwesome
                    {...props}
                    name={iconName}
                    style={{
                        paddingLeft: 4,
                        ...props.style,
                    }}
                />
            );
        case "fa5":
            return <FontAwesome5 name={iconName} {...props} />;
        case "mi":
            return <MaterialIcons name={iconName} {...props} />;
        case "mc":
            return <MaterialCommunityIcons name={iconName} {...props} />;
        default:
            return <FontAwesome name={iconName} {...props} />;
    }
};

export default MultiIcon;
