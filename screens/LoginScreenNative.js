import React, { useState, createRef, useContext, useEffect } from "react";

import {
    SafeAreaView,
    View,
    ScrollView,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    useColorScheme,
} from "react-native";

import { Button, TextInput } from "react-native-paper";

// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";

import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";

import Loader from "../components/Loader";

import { Separator } from "../components/Shared";

import { AppReducer } from "../const";
import { setUserData } from "../reducers/app";

import apiService from "../service/api";
import styles from "../styles";

// WebBrowser.maybeCompleteAuthSession();
GoogleSignin.configure({
    webClientId: "496431691586-8fp98qilt66vsteui7a5kf3ipm4i2rj4.apps.googleusercontent.com",
});

const LoginScreen = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { dispatch } = useContext(AppReducer);

    const [googleLoginEnabled, setGoogleLoginEnabled] = useState(true);

    const [loading, setLoading] = useState(false); // tracks normal login loading
    const [googleLoading, setGoogleLoading] = useState(false); // tracks google auth loading

    const [errorText, setErrorText] = useState(false);

    // tracking login fields
    const [emailAddress, setEmailAddress] = useState("");
    const [userPassword, setUserPassword] = useState("");

    // so we can switch focus after email is complete
    const passwordInputRef = createRef();

    // const [request, response, promptAsync] = Google.useAuthRequest({
    //     expoClientId: "496431691586-9g6qno92idps781s2sto66ar863c8jr4.apps.googleusercontent.com",
    //     androidClientId: "496431691586-8oab0j5ea8upcn0qdatv2j0lco4dplg1.apps.googleusercontent.com",
    //     // iosClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    //     // webClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    // });

    // useEffect(() => {
    //     async function initGoogle() {
    //         try {
    //             if (response?.type === "success") {
    //                 const { authentication } = response;
    //                 console.log("success", authentication);

    //                 const responseJson = await apiService.user.authWithGoogle(authentication.accessToken);
    //                 // setGoogleLoading(false);

    //                 if (responseJson.success) {
    //                     dispatch(setUserData(responseJson.user));
    //                 } else {
    //                     setErrorText(responseJson.message);
    //                 }
    //             }
    //         } finally {
    //             setGoogleLoading(false);
    //         }
    //     }
    //     initGoogle();
    // }, [response]);

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
            // console.error("@34234e", error);
            setLoading(false);
            setErrorText(error.toString());
        }
    };

    const loginFlowGoogle = async () => {
        setGoogleLoading(true);

        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await GoogleSignin.signIn();

            const responseJson = await apiService.user.authWithGoogle(userInfo.idToken);
            if (responseJson.success) {
                dispatch(setUserData(responseJson.user));
            } else {
                setErrorText(responseJson.message);
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                setErrorText("PLAY_SERVICES_NOT_AVAILABLE");
            } else {
                setErrorText("some other error happened");
                // some other error happened
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <SafeAreaView style={[themedStyles.container.base]}>
            {/* <Loader loading={loading} /> */}

            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={themedStyles.container.center}
                style={{ marginLeft: 15, marginRight: 15 }}
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

                    {googleLoginEnabled && (
                        <Button
                            onPress={loginFlowGoogle}
                            disabled={loading || googleLoading}
                            loading={googleLoading}
                            icon="google"
                            mode="contained"
                            color="#4285F4"
                        >
                            Login with Google
                        </Button>
                    )}
                    {googleLoginEnabled && <Separator />}

                    <View>
                        <TextInput
                            style={themedStyles.fields.inputStyle}
                            onChangeText={setEmailAddress}
                            placeholder="Email Address"
                            disabled={loading || googleLoading}
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

                        <TextInput
                            style={themedStyles.fields.inputStyle}
                            onChangeText={setUserPassword}
                            placeholder="Password"
                            disabled={loading || googleLoading}
                            secureTextEntry={true}
                            ref={passwordInputRef}
                            returnKeyType="next"
                            onSubmitEditing={Keyboard.dismiss}
                            blurOnSubmit={false}
                        />
                    </View>

                    <View>
                        <Button
                            onPress={handleSubmitPress}
                            icon="arrow-right"
                            mode="contained"
                            color="green"
                            disabled={loading || googleLoading}
                            loading={loading}
                            contentStyle={themedStyles.button.iconRight}
                        >
                            Login
                        </Button>
                        {/* {errorText ? (
                            <Text style={[themedStyles.text.redCenter, { paddingTop: 10, fontSize: 16 }]}>
                                {errorText}
                            </Text>
                        ) : null} */}
                        <Separator />
                        <Button
                            onPress={() => navigation.navigate("RegisterScreen")}
                            mode="outlined"
                            color="grey"
                            disabled={loading || googleLoading}
                        >
                            Register
                        </Button>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
};

export default LoginScreen;
