import React, { useState, createRef } from "react";

import {
    TextInput,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
} from "react-native";

import apiService from "../service/backend";

import Loader from "../components/Loader";

import styles from "../styles";

const RegisterScreen = (props) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState(false);

    const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const emailInputRef = createRef();
    const passwordInputRef = createRef();

    const handleSubmitButton = async () => {
        setErrorText(false);

        if (!userName) {
            alert("Please enter a Username!");
            return;
        }

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
            const responseJson = await apiService.userRegister(userName, userEmail, userPassword);

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
                <TouchableOpacity
                    style={themedStyles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={() => props.navigation.navigate("LoginScreen")}
                >
                    <Text style={themedStyles.buttonTextStyle}>Login Now</Text>
                </TouchableOpacity>
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
                    <View style={themedStyles.inputContainerView}>
                        <TextInput
                            style={themedStyles.inputStyle}
                            onChangeText={setUserName}
                            placeholder="Username"
                            autoCapitalize="none"
                            returnKeyType="next"
                            onSubmitEditing={() => emailInputRef.current && emailInputRef.current.focus()}
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={themedStyles.inputContainerView}>
                        <TextInput
                            style={themedStyles.inputStyle}
                            onChangeText={setUserEmail}
                            placeholder="Email"
                            keyboardType="email-address"
                            ref={emailInputRef}
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

                    <TouchableOpacity
                        style={themedStyles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={handleSubmitButton}
                    >
                        <Text style={themedStyles.buttonTextStyle}>REGISTER</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

export default RegisterScreen;
