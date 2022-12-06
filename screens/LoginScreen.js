import React, { useState, createRef, useContext, useEffect } from "react";

import {
    StyleSheet,
    TextInput,
    View,
    Text,
    ScrollView,
    Image,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
    useColorScheme,
} from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import Loader from "../components/Loader";

import apiService from "../service/api";

import { AppReducer } from "../const";

import { setUserData } from "../reducers/app";

import styles from "../styles";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { dispatch } = useContext(AppReducer);

    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState(false);
    const [googleLoginEnabled, setGoogleLoginEnabled] = useState(true);

    const [emailAddress, setEmailAddress] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const passwordInputRef = createRef();

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: "496431691586-9g6qno92idps781s2sto66ar863c8jr4.apps.googleusercontent.com",
        // iosClientId: "GOOGLE_GUID.apps.googleusercontent.com",
        androidClientId: "496431691586-8oab0j5ea8upcn0qdatv2j0lco4dplg1.apps.googleusercontent.com",
        // webClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    });

    useEffect(() => {
        async function initGoogle() {
            if (response?.type === "success") {
                const { authentication } = response;

                console.log(authentication);

                const responseJson = await apiService.user.authWithGoogle(authentication.accessToken);

                if (responseJson.success) {
                    setLoading(false);
                    dispatch(setUserData(responseJson.user));
                } else {
                    setErrorText(responseJson.message);
                    setLoading(false);
                }
            }
        }
        initGoogle();
    }, [response]);

    const handleSubmitPress = async () => {
        setErrorText(false);

        if (!emailAddress) {
            alert("Please enter your Email!");
            return;
        }

        if (!userPassword) {
            alert("Please enter your Password!");
            return;
        }

        setLoading(true);

        try {
            const responseJson = await apiService.user.emailLogin(emailAddress, userPassword);

            if (responseJson.success) {
                console.log(responseJson);
                setLoading(false);
                dispatch(setUserData(responseJson.user));
            } else {
                setErrorText(responseJson.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("@34234e", error);
            setLoading(false);
            setErrorText(error.toString());
        }
    };

    const loginFlowGoogle = async () => {
        setLoading(true);

        promptAsync();
    };

    return (
        <View style={[themedStyles.screenContainer, themedStyles.authScreenContainer]}>
            <Loader loading={loading || !request} />

            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                <View>
                    <KeyboardAvoidingView enabled>
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

                        {googleLoginEnabled && (
                            <TouchableOpacity
                                style={themedStyles.buttonStyle}
                                activeOpacity={0.5}
                                onPress={loginFlowGoogle}
                            >
                                <Text style={themedStyles.buttonTextStyle}>Login with Google</Text>
                            </TouchableOpacity>
                        )}

                        <View style={themedStyles.inputContainerView}>
                            <TextInput
                                style={themedStyles.inputStyle}
                                placeholderTextColor={themedStyles.inputStyle.color}
                                onChangeText={setEmailAddress}
                                placeholder="Email Address"
                                autoCapitalize="none"
                                returnKeyType="next"
                                autoCompleteType="email"
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                onSubmitEditing={() =>
                                    passwordInputRef.current && passwordInputRef.current.focus()
                                }
                                blurOnSubmit={false}
                            />
                        </View>
                        <View style={themedStyles.inputContainerView}>
                            <TextInput
                                style={themedStyles.inputStyle}
                                placeholderTextColor={themedStyles.inputStyle.color}
                                onChangeText={setUserPassword}
                                placeholder="Password"
                                secureTextEntry={true}
                                ref={passwordInputRef}
                                returnKeyType="next"
                                onSubmitEditing={Keyboard.dismiss}
                                blurOnSubmit={false}
                            />
                        </View>
                        {errorText ? <Text style={themedStyles.errorTextStyle}>{errorText}</Text> : null}
                        <TouchableOpacity
                            style={themedStyles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={handleSubmitPress}
                        >
                            <Text style={themedStyles.buttonTextStyle}>LOGIN</Text>
                        </TouchableOpacity>
                        <Text
                            style={themedStyles.actionTextStyle}
                            onPress={() => navigation.navigate("RegisterScreen")}
                        >
                            Register Account
                        </Text>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </View>
    );
};

export default LoginScreen;
