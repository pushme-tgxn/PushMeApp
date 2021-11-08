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

import * as GoogleSignIn from "expo-google-sign-in";

import Loader from "../components/Loader";

import apiService from "../service/backend";

import { AppReducer } from "../const";

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

    useEffect(() => {
        async function initGoogle() {
            try {
                await GoogleSignIn.initAsync();
            } catch ({ message }) {
                alert("GoogleSignIn.initAsync(): " + message);
            }
        }
        initGoogle();
    });

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

        try {
            await GoogleSignIn.askForPlayServicesAsync();
            const { type, user } = await GoogleSignIn.signInAsync();
            if (type === "success") {
                console.log(type, user);

                alert(JSON.stringify(user));

                const responseJson = await apiService.authWithGoogle(user.auth.accessToken);

                console.log(responseJson);

                if (responseJson.user.token) {
                    setLoading(false);
                    dispatch(setUserData(responseJson.user));
                } else {
                    setErrorText(responseJson.message);
                    setLoading(false);
                }
            }
        } catch ({ message }) {
            alert("login: Error:" + message);
        }
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

                        <TouchableOpacity
                            style={themedStyles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={loginFlowGoogle}
                        >
                            <Text style={themedStyles.buttonTextStyle}>Login with Google</Text>
                        </TouchableOpacity>

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
