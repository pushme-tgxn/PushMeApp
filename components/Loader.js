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
        console.log("close modal");
      }}
    >
      <View style={themedStyles.modalBackground}>
        <View style={themedStyles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={true}
            color="#000000"
            size="large"
            style={themedStyles.activityIndicator}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
