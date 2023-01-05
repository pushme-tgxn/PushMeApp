import React, { useState, createRef } from "react";

import {
    SafeAreaView,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    ScrollView,
    useColorScheme,
} from "react-native";

import { Button, TextInput } from "react-native-paper";

import { dispatchSDKError } from "../reducers/app";

import { showToast } from "../components/Shared";

import apiService from "../service/api";
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
            showToast("❌ Please enter your Email Address!");
            return;
        }

        if (!userPassword) {
            showToast("❌ Please enter your Password!");
            return;
        }

        setLoading(true);

        try {
            const responseJson = await apiService.user.emailRegister(userEmail, userPassword);

            if (responseJson.success) {
                setIsRegistraionSuccess(true);
                showToast("✅ Registration Successful. You may now login.");
            } else {
                setErrorText(responseJson.message);
            }
        } catch (error) {
            setErrorText(error.toString());
            // console.error(error);
            dispatchSDKError(dispatch, error);
        } finally {
            setLoading(false);
        }
    };

    if (isRegistraionSuccess) {
        return (
            <SafeAreaView style={[themedStyles.container.base, themedStyles.container.center]}>
                <View>
                    <Image
                        source={require("../assets/namelogo.png")}
                        style={{
                            width: 200,
                            height: 150,
                            resizeMode: "contain",
                            margin: 30,
                        }}
                    />
                </View>
                <Text>Registration Successful</Text>
                <Button
                    onPress={() => props.navigation.navigate("LoginScreen")}
                    icon="arrow-right"
                    mode="contained"
                    color="green"
                    style={{ margin: 10 }}
                >
                    Login Now
                </Button>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={[themedStyles.container.base]}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={themedStyles.container.center}
            >
                <KeyboardAvoidingView enabled>
                    <View style={{ alignItems: "center" }}>
                        <Image
                            source={require("../assets/namelogo.png")}
                            style={{
                                width: 200,
                                height: 150,
                                resizeMode: "contain",
                                marginBottom: 30, // pad between logo and button
                            }}
                        />
                    </View>

                    <TextInput
                        style={themedStyles.fields.inputStyle}
                        onChangeText={setUserEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                        ref={emailInputRef}
                        returnKeyType="next"
                        autoCapitalize="none"
                        autoCompleteType="email"
                        textContentType="emailAddress"
                        onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
                        blurOnSubmit={false}
                    />

                    <TextInput
                        style={themedStyles.fields.inputStyle}
                        onChangeText={setUserPassword}
                        placeholder="Password"
                        secureTextEntry={true}
                        ref={passwordInputRef}
                        returnKeyType="next"
                        onSubmitEditing={Keyboard.dismiss}
                        blurOnSubmit={false}
                    />

                    {/* {errorText != "" ? <Text style={themedStyles.errorTextStyle}>{errorText}</Text> : null} */}
                    {errorText ? (
                        <Text style={[themedStyles.text.redCenter, { paddingVertical: 10, fontSize: 16 }]}>
                            {errorText}
                        </Text>
                    ) : null}
                    <Button
                        onPress={handleSubmitButton}
                        icon="arrow-right"
                        mode="contained"
                        color="green"
                        loading={loading}
                        disabled={loading}
                        contentStyle={themedStyles.button.iconRight}
                        // style={{ margin: 10 }}
                    >
                        Register
                    </Button>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RegisterScreen;
