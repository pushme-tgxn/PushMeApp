import React, { useState, createRef } from "react";

import { View, Text, Image, KeyboardAvoidingView, Keyboard, ScrollView, useColorScheme } from "react-native";

import { Button, TextInput } from "react-native-paper";

import apiService from "../service/api";

import Loader from "../components/Loader";

import styles from "../styles";

const RegisterScreen = (props) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState(false);

    const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const emailInputRef = createRef();
    const passwordInputRef = createRef();

    const handleSubmitButton = async () => {
        setErrorText(false);

        if (!userEmail) {
            alert("Please enter an Email!");
            return;
        }

        if (!userPassword) {
            alert("Please enter a Password!");
            return;
        }

        setLoading(true);

        try {
            const responseJson = await apiService.user.emailRegister(userEmail, userPassword);

            if (responseJson.success) {
                setIsRegistraionSuccess(true);
                console.log("Registration Successful. Please Login to proceed");
            } else {
                setErrorText(responseJson.message);
            }
        } catch (error) {
            setErrorText(error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (isRegistraionSuccess) {
        return (
            <View style={[themedStyles.screenContainer, themedStyles.authScreenContainer]}>
                <Text style={themedStyles.successTextStyle}>Registration Successful</Text>
                <Button
                    onPress={() => props.navigation.navigate("LoginScreen")}
                    icon="arrow-right"
                    mode="contained"
                    color="green"
                    style={{ margin: 10 }}
                >
                    Login Now
                </Button>
            </View>
        );
    }
    return (
        <View style={[themedStyles.screenContainer, themedStyles.authScreenContainer]}>
            <Loader loading={loading} />

            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                <View style={{ alignItems: "center" }}>
                    <Image
                        source={require("../assets/namelogo.png")}
                        style={{
                            width: "50%",
                            height: 100,
                            resizeMode: "contain",
                            margin: 30,
                        }}
                    />
                </View>

                <KeyboardAvoidingView enabled>
                    <View>
                        <TextInput
                            style={themedStyles.inputStyle}
                            onChangeText={setUserEmail}
                            placeholder="Email"
                            keyboardType="email-address"
                            ref={emailInputRef}
                            returnKeyType="next"
                            autoCapitalize="none"
                            autoCompleteType="email"
                            textContentType="emailAddress"
                            onSubmitEditing={() =>
                                passwordInputRef.current && passwordInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />

                        <TextInput
                            style={themedStyles.inputStyle}
                            onChangeText={setUserPassword}
                            placeholder="Password"
                            secureTextEntry={true}
                            ref={passwordInputRef}
                            returnKeyType="next"
                            onSubmitEditing={Keyboard.dismiss}
                            blurOnSubmit={false}
                        />
                    </View>

                    {errorText != "" ? <Text style={themedStyles.errorTextStyle}>{errorText}</Text> : null}
                    <View>
                        <Button
                            onPress={handleSubmitButton}
                            icon="arrow-right"
                            mode="contained"
                            color="green"
                            style={{ margin: 10 }}
                        >
                            Register
                        </Button>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

export default RegisterScreen;
