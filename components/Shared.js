import React from "react";

import { Text, View, TouchableOpacity, useColorScheme } from "react-native";

import styles from "../styles";

export const Separator = () => {
  const colorScheme = useColorScheme();
  const themedStyles = styles(colorScheme);

  return <View style={themedStyles.separator} />;
};

export const CustomButton = (props) => {
  const colorScheme = useColorScheme();
  const themedStyles = styles(colorScheme);

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[themedStyles.button, props.style]}
    >
      <Text style={themedStyles.buttonText}>
        {props.title ? props.title : props.children}
      </Text>
    </TouchableOpacity>
  );
};
