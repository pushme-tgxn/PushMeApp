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

import * as Google from "expo-auth-session/providers/google";

import Loader from "../components/Loader";

import apiService from "../service/backend";

import { AppReducer, GOOGLE_WEBCLIENT_ID } from "../const";

import { setUserData } from "../reducers/app";

import styles from "../styles";

const LoginScreen = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { dispatch } = useContext(AppReducer);

    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState(false);

    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const passwordInputRef = createRef();

    let request, response, promptAsync;
    if (GOOGLE_WEBCLIENT_ID) {
        [request, response, promptAsync] = Google.useAuthRequest({
            expoClientId: GOOGLE_WEBCLIENT_ID,
            iosClientId: "GOOGLE_GUID.apps.googleusercontent.com",
            androidClientId: GOOGLE_WEBCLIENT_ID,
            webClientId: "GOOGLE_GUID.apps.googleusercontent.com",
        });
    }

    useEffect(() => {
        async function fetchData(authentication) {
            try {
                // const responseJson = await apiService.userLogin(userName, userPassword);

                const responseJson = await apiService.authWithGoogle(authentication.accessToken);

                console.log(responseJson);

                if (responseJson.user.token) {
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
        }

        if (response?.type === "success") {
            const { authentication } = response;
            console.log(authentication);

            fetchData(authentication);
        }
    }, [response]);

    const handleSubmitPress = async () => {
        setErrorText(false);

        if (!userName) {
            alert("Please enter your Username!");
            return;
        }

        if (!userPassword) {
            alert("Please enter your Password!");
            return;
        }

        setLoading(true);

        try {
            const responseJson = await apiService.userLogin(userName, userPassword);

            if (responseJson.token) {
                setLoading(false);
                dispatch(setUserData(responseJson));
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
            <Loader loading={loading} />

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

                        {GOOGLE_WEBCLIENT_ID && (
                            <TouchableOpacity
                                style={themedStyles.buttonStyle}
                                activeOpacity={0.5}
                                disabled={!request}
                                onPress={loginFlowGoogle}
                            >
                                <Text style={themedStyles.buttonTextStyle}>Login with Google</Text>
                            </TouchableOpacity>
                        )}

                        <View style={themedStyles.inputContainerView}>
                            <TextInput
                                style={themedStyles.inputStyle}
                                placeholderTextColor={themedStyles.inputStyle.color}
                                onChangeText={setUserName}
                                placeholder="Username"
                                autoCapitalize="none"
                                returnKeyType="next"
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
