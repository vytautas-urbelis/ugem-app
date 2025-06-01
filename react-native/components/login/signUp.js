import {Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";

import {controlStorage} from "../../MMKV/control";
import * as Haptics from "expo-haptics";
import {Checkbox} from "../smallComponents/checkbox";
import {checkPassword, validateEmail} from "../../utils/auth";
import {router} from "expo-router";
import {authStorage} from "../../MMKV/auth";
import {colors} from "../../constants/colors";
import UGEM from "../../assets/svg/uGem.svg";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {MEDIA_URL} from "../../utils/CONST";

import {GoogleSignin, statusCodes} from "@react-native-google-signin/google-signin";
import SaveLoader from "../smallComponents/smLoader";
import GOOGLE from "../../assets/pngs/google.png";
import {AuthenticateCustomer, CreateCustomerAccount} from "../../axios/axiosCustomer/customerAuth";
import {saveCustomerMMKV} from "../../MMKV/mmkvCustomer/user";
import {AppleSignUp, GoogleSignUp} from "../../axios/0Auth";
import {useMMKVBoolean} from "react-native-mmkv";
import APPLE from "../../assets/pngs/apple.png";
import * as AppleAuthentication from "expo-apple-authentication";
import {ScrollView, TextInput} from "react-native-gesture-handler";

const SignUp = ({
                    scrollToPage,
                    pageNumber,
                    setLoginModal,
                    email,
                    setEmail,
                    password,
                    setPassword,
                    repeatPassword,
                    setRepeatPassword,
                    setGoogleData,
                    setAppleData,
                }) => {
    // State hooks for managing form data, errors, and UI loading states
    const [loader, setLoader] = useState(false); // Loader state for handling loading UI
    const [error, setError] = useState(""); // Error message state

    const [activeWebSockets, setActiveWebSockets] = useMMKVBoolean("activeWebSockets", controlStorage);

    const [isSelected, setIsSelected] = useState(false);
    const [loginToBusinessAcc, setLoginToBusinessAcc] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(true);
    const [isInProgress, setIsInProgress] = useState(false);

    // Animation settings
    const scale = useSharedValue(0.7);
    const opacity = useSharedValue(0.2);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        if (pageNumber === 1) {
            scale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
            opacity.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
        }
        if (pageNumber === 0 || pageNumber === 2) {
            scale.value = withTiming(0.7, {duration: 200, easing: Easing.in(Easing.exp)});
            opacity.value = withTiming(1, {duration: 100, easing: Easing.in(Easing.exp)});
        }
    }, [pageNumber]);

    // Ensure all required fields are filled in
    const checkIfFiledIn = () => {
        if (email && password && repeatPassword) {
            setError("");
            return true;
        } else {
            setError("You need to fill in all fields.");
            return false;
        }
    };

    // Check agreed on TS
    const checkIfAgreeTS = () => {
        if (!isSelected) {
            setError("Please agree to our Privacy Policy and Terms of Service.");
            return false;
        }
        setError("");
        return true;
    };

    // Handle registration form submission
    const handleBusinessRegister = async () => {
        setLoader(true); // Show loader
        try {
            if (validateEmail(email, setError) && checkIfFiledIn() && checkPassword(password, repeatPassword, setError) && checkIfAgreeTS()) {
                scrollToPage(2);
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        } catch {
        } finally {
            setLoader(false); // Ensure loader is hidden
        }
    };

    // Google Sign-Up business function
    const googleSignUpBusiness = async () => {
        if (checkIfAgreeTS()) {
            try {
                setIsInProgress(true);
                await GoogleSignin.hasPlayServices();
                const userInfo = await GoogleSignin.signIn();
                setGoogleData(userInfo);
                setError("");
                scrollToPage(2);
            } catch (error) {
                console.log("Google Sign-In error:", error.response.data.error);
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                    // User cancelled the sign-in process
                } else if (error.code === statusCodes.IN_PROGRESS) {
                    // Operation (e.g., sign in) is in progress already
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    // Play Services not available or outdated
                } else {
                }
            } finally {
                setIsInProgress(false);
            }
        }
    };

    // Google Sign-Up function
    const googleSignUpCustomer = async () => {
        if (checkIfAgreeTS()) {
            try {
                const is_business = loginToBusinessAcc ? true : "";
                setIsInProgress(true);
                await GoogleSignin.hasPlayServices();
                const userInfo = await GoogleSignin.signIn();
                const data = await GoogleSignUp(userInfo.data, userInfo.data.user, is_business);
                controlStorage.set("customerIsLogedIn", true);
                authStorage.set("accessToken", data.access);
                authStorage.set("refreshToken", data.refresh);
                saveCustomerMMKV(data.customer);
                setActiveWebSockets(true);
                setError("");
                setLoginModal(false);
                // setEmailInputModal(false);
                router.replace("homeCustomer");
            } catch (error) {
                console.log("Google Sign-In error:", error.response.data.error);
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                    // User cancelled the sign-in process
                } else if (error.code === statusCodes.IN_PROGRESS) {
                    // Operation (e.g., sign in) is in progress already
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    // Play Services not available or outdated
                } else if (error.response.data.error === "You don't have business account") {
                    setError(error.response.data.error);
                }
            } finally {
                setIsInProgress(false);
            }
        }
    };

    // Apple Sign-Up business function
    const appleSignUpBusiness = async () => {
        if (checkIfAgreeTS()) {
            try {
                setIsInProgress(true);
                const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
                });
                setAppleData(credential);
                setError("");
                scrollToPage(2);
            } catch (error) {
                console.log("Google Sign-In error:", error.response.data.error);
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                    // User cancelled the sign-in process
                } else if (error.code === statusCodes.IN_PROGRESS) {
                    // Operation (e.g., sign in) is in progress already
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    // Play Services not available or outdated
                } else {
                }
            } finally {
                setIsInProgress(false);
            }
        }
    };

    // Apple Sign-Up function
    const appleSignUpCustomer = async () => {
        if (checkIfAgreeTS()) {
            try {
                const is_business = loginToBusinessAcc ? true : "";
                setIsInProgress(true);
                const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
                });
                const data = await AppleSignUp(credential, is_business);
                controlStorage.set("customerIsLogedIn", true);
                authStorage.set("accessToken", data.access);
                authStorage.set("refreshToken", data.refresh);
                saveCustomerMMKV(data.customer);
                setActiveWebSockets(true);
                setError("");
                setLoginModal(false);
                // setEmailInputModal(false);
                router.replace("homeCustomer");
            } catch (error) {
                console.log("Google Sign-In error:", error.response.data.error);
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                    // User cancelled the sign-in process
                } else if (error.code === statusCodes.IN_PROGRESS) {
                    // Operation (e.g., sign in) is in progress already
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    // Play Services not available or outdated
                } else if (error.response.data.error === "You don't have business account") {
                    setError(error.response.data.error);
                }
            } finally {
                setIsInProgress(false);
            }
        }
    };

    // Handle registration form submission
    const handleRegister = async () => {
        setLoader(true); // Show loader
        try {
            if (validateEmail(email, setError) && checkIfFiledIn() && checkPassword(password, repeatPassword, setError) && checkIfAgreeTS()) {
                try {
                    // Call API to register customer
                    await CreateCustomerAccount(email, password);
                    // Authenticate business after registration
                    const data = await AuthenticateCustomer(email, password);
                    setError("");
                    controlStorage.set("customerIsLogedIn", true); // Set user as logged in
                    authStorage.set("accessToken", data.access);
                    authStorage.set("refreshToken", data.refresh);
                    saveCustomerMMKV(data.customer); // Save business data
                    setActiveWebSockets(true);
                    setLoginModal(false); // Close signup modal
                    router.navigate("homeCustomer");
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } catch (error) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    console.log(error.response.data);
                    if (error.response.data === "User with this email already exists.") {
                        return setError("User with this email already exists.");
                    }
                    alert("Something went wrong.");
                } finally {
                    setLoader(false); // Hide loader
                }
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        } catch {
        } finally {
            setLoader(false); // Ensure loader is hidden
        }
    };

    return (
        <ScrollView nestedScrollEnabled={true} className="h-screen w-screen p-6 flex-1">
            {/*<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'padding'}>*/}
            <Animated.View style={animatedStyle} className="w-full mt-14  max-w-[600]">
                <View className="w-full items-center mb-8">
                    <UGEM width={200} height={36} fill={colors.zest["400"]}/>
                </View>
                <View className=" justify-between  w-full flex-row mb-8">
                    <Text className="text-xl font-semibold">I want to create business account.</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setLoginToBusinessAcc(!loginToBusinessAcc);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }}>
                        <Checkbox size={24} isChecked={loginToBusinessAcc} color={colors["zest"]["500"]}/>
                    </TouchableOpacity>
                </View>
                {/*<View className="mb-5">*/}
                {/*    <Text className="pb-4 mb-4 text-center text-ship-gray-900  text-4xl font-bold">*/}
                {/*        Sign Up*/}
                {/*    </Text>*/}
                {/*</View>*/}
                <View className=" items-center ">
                    {/* Address modal for selecting business address */}

                    <View className=" w-full">
                        {/* Form Container */}
                        <View className=" justify-start items-center w-full">
                            {/* Input fields for signup */}

                            <View className="mb-6 w-full">
                                {/*<Text*/}
                                {/*    className=" mt-2 text-ship-gray-700 w-full text-left text-xl font-semibold mb-1">Password</Text>*/}
                                <TextInput
                                    style={{borderColor: colors["ship-gray"]["200"]}}
                                    className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white"
                                    inputMode={"email"}
                                    autoCapitalize="none"
                                    onChangeText={(text) => setEmail(text)}
                                />
                                <Text
                                    className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Email
                                    address</Text>
                            </View>

                            {/* Password fields */}
                            <View className="mb-6 w-full">
                                {/*<Text*/}
                                {/*    className=" mt-2 text-ship-gray-700 w-full text-left text-xl font-semibold mb-1">Password</Text>*/}
                                <TextInput
                                    style={{borderColor: colors["ship-gray"]["200"]}}
                                    className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white"
                                    secureTextEntry={true}
                                    onChangeText={(text) => setPassword(text)}
                                />
                                <Text
                                    className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Password</Text>
                            </View>
                            <View className="mb-2 w-full">
                                {/*<Text*/}
                                {/*    className=" mt-2 text-ship-gray-700 w-full text-left text-xl font-semibold mb-1">Password</Text>*/}
                                <TextInput
                                    style={{borderColor: colors["ship-gray"]["200"]}}
                                    className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white"
                                    secureTextEntry={true}
                                    onChangeText={(text) => setRepeatPassword(text)}
                                />
                                <Text
                                    className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Repeat
                                    Password</Text>
                            </View>
                            {error ? <Text
                                className="text-center w-full text-red-500 text-base font-semibold">{error}</Text> : null}
                            <View className="mt-2 flex-row justify-between w-full">
                                <Text className="text-lg text-left w-[90%]">
                                    I agree to the uGem
                                    <Text onPress={() => Linking.openURL(`${MEDIA_URL}privacy-policy`)}
                                          className="text-lg font-bold text-left">
                                        {" "}
                                        Privacy Policy{" "}
                                    </Text>
                                    and
                                    <Text onPress={() => Linking.openURL(`${MEDIA_URL}terms-of-use`)}
                                          className="font-bold text-lg">
                                        {" "}
                                        Terms of Service
                                    </Text>
                                </Text>
                                <TouchableOpacity
                                    className="w-[10%] items-end"
                                    onPress={() => {
                                        setIsSelected(!isSelected);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    }}>
                                    <Checkbox size={24} isChecked={isSelected} color={colors["zest"]["500"]}/>
                                </TouchableOpacity>
                            </View>

                            {/* Submit button */}
                            {/*<View className="w-full">*/}
                            {/*    <SubmitButtonNew value={"Sign up"} isSaving={loader} handle={handleRegister}/>*/}
                            {/*</View>*/}
                            <TouchableOpacity
                                disabled={loader}
                                onPress={() => {
                                    loginToBusinessAcc ? handleBusinessRegister() : handleRegister();
                                }}
                                className="w-full rounded-lg bg-ship-gray-900 items-center justify-center mt-3">
                                {loader ? (
                                    <View className="p-5">
                                        <SaveLoader/>
                                    </View>
                                ) : (
                                    <Text className="text-center w-full p-5 text-white font-semibold text-xl">Sign
                                        Up</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity className="w-full justify-center items-center mt-6 h-10"
                                              onPress={() => scrollToPage(0)}>
                                <Text className="font-normal text-gray-900">
                                    Already have an account? <Text className="font-bold text-zest-400">Login</Text>
                                </Text>
                            </TouchableOpacity>
                            <View className="border-b w-full border-ship-gray-300 items-center justify-center my-6">
                                <Text className="absolute bg-white px-2">OR</Text>
                            </View>
                            {Platform.OS === "ios" && (
                                <TouchableOpacity
                                    onPress={() => {
                                        loginToBusinessAcc ? appleSignUpBusiness() : appleSignUpCustomer();
                                        // signUpBusiness()
                                    }}
                                    className="w-full rounded-lg bg-black  items-center justify-center mt-4">
                                    <View className="w-full items-center justify-center flex-row p-[18]">
                                        <Image source={APPLE} className="w-6 h-7 mr-3" alt="Apple logo"/>
                                        <Text className="text-xl font-semibold text-white">Sign up with Apple</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            {isInProgress ? (
                                <View
                                    className="w-full rounded-lg bg-white border border-ship-gray-300 items-center justify-center mt-4 opacity-60">
                                    <View className="w-full items-center justify-center flex-row p-3">
                                        <Image
                                            source={GOOGLE}
                                            className="w-10 h-10 rounded-md opacity-100"
                                            alt="Campaign Logo"
                                            onLoad={() => setImageLoaded(true)}
                                        />
                                        <Text className="text-xl font-semibold text-ship-gray-800">Sign up with
                                            Google</Text>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => {
                                        loginToBusinessAcc ? googleSignUpBusiness() : googleSignUpCustomer();
                                        // signUpBusiness()
                                    }}
                                    className="w-full rounded-lg bg-white border border-ship-gray-300 items-center justify-center mt-4">
                                    <View className="w-full items-center justify-center flex-row p-3">
                                        <Image
                                            source={GOOGLE}
                                            className="w-10 h-10 rounded-md opacity-100"
                                            alt="Campaign Logo"
                                            onLoad={() => setImageLoaded(true)}
                                        />
                                        <Text className="text-xl font-semibold text-ship-gray-800">Sign up with
                                            Google</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Animated.View>
        </ScrollView>
    );
};

export default SignUp;

// Styles for shadows
const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 7.84,
        elevation: 10,
    },
});
