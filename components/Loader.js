import React from "react";

import { View, Modal, ActivityIndicator, useColorScheme } from "react-native";

import styles from "../styles";

const Loader = (props) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { loading, ...attributes } = props;

    return (
        <Modal
            transparent={true}
            animationType={"none"}
            visible={loading}
            onRequestClose={() => {
                console.log("Loader close modal");
            }}
        >
            <View style={themedStyles.modal.background}>
                <View style={themedStyles.modal.activityIndicatorWrapper}>
                    <ActivityIndicator
                        animating={true}
                        color="#000000"
                        size="large"
                        style={themedStyles.modal.activityIndicator}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default Loader;
