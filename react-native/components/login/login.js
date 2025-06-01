import React, {useEffect, useRef, useState} from "react";
import {Dimensions, Image, Platform, Text, TouchableOpacity, View} from "react-native";
import {GoogleSignin, statusCodes} from "@react-native-google-signin/google-signin";
import * as Haptics from "expo-haptics";
import GOOGLE from "../../assets/pngs/google.png";
import APPLE from "../../assets/pngs/apple.png";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Checkbox} from "../smallComponents/checkbox";
import {AppleAuthSignIn, GoogleAuthSignIn} from "../../axios/0Auth";
import SignUp from "./signUp";
import {GestureHandlerRootView, ScrollView, TextInput,} from "react-native-gesture-handler";
import SignUpBusiness from "./signUpBusiness";
import {colors} from "../../constants/colors";

import UGEM from "../../assets/svg/uGem.svg";
import SaveLoader from "../smallComponents/smLoader";
import {controlStorage} from "../../MMKV/control";
import {authStorage} from "../../MMKV/auth";
import {saveCustomerMMKV} from "../../MMKV/mmkvCustomer/user";
import {router} from "expo-router";
import {saveBusinessMMKV} from "../../MMKV/mmkvBusiness/user";
import {useMMKVBoolean} from "react-native-mmkv";

import * as AppleAuthentication from "expo-apple-authentication";


const Login = ({
                   setEmail,
                   setPassword,
                   handleLogin,
                   handleBusinessLogin,
                   loader,
                   anError,
                   setAnError,
                   setLoginModal,
                   setForgotPasswordUpModal,
               }) => {
    const [imageLoaded, setImageLoaded] = useState(true);
    const [loginToBusinessAcc, setLoginToBusinessAcc] = useState(false);
    const [isInProgress, setIsInProgress] = useState(false);

    const [emailRegister, setEmailRegister] = useState(null); // Email input state
    const [passwordRegister, setPasswordRegister] = useState(null); // Password input state
    const [repeatPasswordRegister, setRepeatPasswordRegister] = useState(null); // Repeat password input state
    const [googleData, setGoogleData] = useState(null); // Repeat password input state
    const [appleData, setAppleData] = useState(null); // Repeat password input state

    const [activeWebSockets, setActiveWebSockets] = useMMKVBoolean("activeWebSockets", controlStorage);

    const [pageNumber, setPageNumber] = useState(0);

    const {width} = Dimensions.get("window");

    const scrollRef = useRef();

    const scale = useSharedValue(0.1);
    const opacity = useSharedValue(0.2);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        if (pageNumber === 0) {
            scale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
            opacity.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
        }
        if (pageNumber === 1) {
            scale.value = withTiming(0.6, {duration: 160, easing: Easing.in(Easing.exp)});
            opacity.value = withTiming(1, {duration: 100, easing: Easing.in(Easing.exp)});
        }
    }, [pageNumber]);

    // Google Sign-In function
    const googleSignIn = async () => {
        try {
            const is_business = loginToBusinessAcc ? true : "";
            setIsInProgress(true);
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const data = await GoogleAuthSignIn(userInfo.data, userInfo.data.user, is_business);

            if (is_business) {
                controlStorage.set("businessIsLogedIn", true);
                authStorage.set("accessToken", data.access);
                authStorage.set("refreshToken", data.refresh);
                saveBusinessMMKV(data.business);
                setAnError("");
                setLoginModal(false);
                // setEmailInputModal(false);
                router.replace("homeBusiness");
            } else if (!is_business) {
                controlStorage.set("customerIsLogedIn", true);
                authStorage.set("accessToken", data.access);
                authStorage.set("refreshToken", data.refresh);
                saveCustomerMMKV(data.customer);
                setAnError("");
                setActiveWebSockets(true);
                setLoginModal(false);
                // setEmailInputModal(false);
                router.replace("homeCustomer");
            }
        } catch (error) {
            console.log("Google Sign-In error:", error.response.data.error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // User cancelled the sign-in process
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // Operation (e.g., sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // Play Services not available or outdated
            } else if (error.response.data.error === "You need first to create business account") {
                setAnError(error.response.data.error);
            }
        } finally {
            setIsInProgress(false);
        }
    };

    // Apple Sign-In function
    const appleSignIn = async () => {
        try {
            const is_business = loginToBusinessAcc ? true : "";
            setIsInProgress(true);
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
            });
            console.log('Creadentials', credential)
            const data = await AppleAuthSignIn(credential, is_business);
            // signed in
            if (is_business) {
                controlStorage.set("businessIsLogedIn", true);
                authStorage.set("accessToken", data.access);
                authStorage.set("refreshToken", data.refresh);
                saveBusinessMMKV(data.business);
                setAnError("");
                setLoginModal(false);
                // setEmailInputModal(false);
                router.replace("homeBusiness");
            } else if (!is_business) {
                controlStorage.set("customerIsLogedIn", true);
                authStorage.set("accessToken", data.access);
                authStorage.set("refreshToken", data.refresh);
                saveCustomerMMKV(data.customer);
                setAnError("");
                setActiveWebSockets(true);
                setLoginModal(false);
                // setEmailInputModal(false);
                router.replace("homeCustomer");
            }
        } catch (error) {
            if (error.code === "ERR_REQUEST_CANCELED") {
                console.log(error.response.data.error);
            } else if (error.response.data.error === "You need first to create business account") {
                setAnError(error.response.data.error);
            } else {
                console.log("Apple Sign-In error:", error);
            }
        } finally {
            setIsInProgress(false);
        }
    };

    const scrollToPage = (page) => {
        setPageNumber(page);
        scrollRef.current?.scrollTo({x: Dimensions.get("window").width * page, animated: true});
    };

    return (
        <GestureHandlerRootView>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                ref={scrollRef}
                className="h-screen"
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                nestedScrollEnabled={true}
                scrollEnabled={false}
                scrollToOverflowEnabled={true}>
                <ScrollView keyboardShouldPersistTaps="handled"
                            nestedScrollEnabled={true}
                            className="h-screen w-screen p-6">
                    <Animated.View style={animatedStyle} className="mt-14 w-full  max-w-[600]  items-center mb-16">
                        <View className="w-full items-center mb-12">
                            <UGEM width={200} height={36} fill={colors.zest["400"]}/>
                        </View>
                        <View className="mb-5">
                            <Text className="pb-4 mb-4 text-center text-ship-gray-900  text-4xl font-bold">Welcome
                                back</Text>
                        </View>

                        <View className="mb-6 w-full">
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
                        <View className="mb-2 w-full">
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

                        <TouchableOpacity
                            onPress={() => {
                                setForgotPasswordUpModal(true);
                                setLoginModal(false);
                            }}
                            className="w-full justify-center items-center h-6 mb-4">
                            <View>
                                <Text className="font-normal text-gray-900">Forgot password?</Text>
                            </View>
                        </TouchableOpacity>

                        {anError ? <Text className="text-center w-full text-red-500 mb-3">{anError}</Text> : null}
                        <View className=" inline-block justify-center items-end w-full">
                            <View className="flex-row items-center justify-center">
                                <Text className="text-lg mr-1">Sign in to my Business account</Text>
                                <TouchableOpacity
                                    className=""
                                    onPress={() => {
                                        setLoginToBusinessAcc(!loginToBusinessAcc);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    }}>
                                    <Checkbox size={24} isChecked={loginToBusinessAcc}
                                              color={colors["ship-gray"]["900"]}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            disabled={loader}
                            onPress={() => {
                                loginToBusinessAcc ? handleBusinessLogin() : handleLogin();
                            }}
                            className="w-full rounded-lg bg-ship-gray-900 items-center justify-center mt-3">
                            {loader ? (
                                <View className="p-5">
                                    <SaveLoader/>
                                </View>
                            ) : (
                                <Text className="text-center w-full p-5 text-white font-semibold text-xl">Sign
                                    In</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                scrollToPage(1);
                                setAnError("");
                            }}
                            className="w-full justify-center items-center mt-6 h-10">
                            <View>
                                <Text className="font-normal text-gray-900">
                                    Don't have an account? <Text className="font-bold text-zest-400">Sign Up</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View className="border-b border-ship-gray-300 items-center justify-center my-6">
                            <Text className="absolute bg-white px-2">OR</Text>
                        </View>
                        {Platform.OS === "ios" && (
                            <TouchableOpacity onPress={appleSignIn}
                                              className="w-full rounded-lg bg-black  items-center justify-center mt-4">
                                <View className="w-full items-center justify-center flex-row p-[18]">
                                    <Image source={APPLE} className="w-6 h-7 mr-3" alt="Apple logo"/>
                                    <Text className="text-xl font-semibold text-white">Sign in with Apple</Text>
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
                                    <Text className="text-xl font-semibold text-ship-gray-800">Sign in with
                                        Google</Text>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={googleSignIn}
                                className="w-full rounded-lg bg-white border border-ship-gray-300 items-center justify-center mt-4">
                                <View className="w-full items-center justify-center flex-row p-3">
                                    <Image
                                        source={GOOGLE}
                                        className="w-10 h-10 rounded-md opacity-100"
                                        alt="Campaign Logo"
                                        onLoad={() => setImageLoaded(true)}
                                    />
                                    <Text className="text-xl font-semibold text-ship-gray-800">Sign in with
                                        Google</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </ScrollView>
                <SignUp
                    setRepeatPassword={setRepeatPasswordRegister}
                    repeatPassword={repeatPasswordRegister}
                    password={passwordRegister}
                    setPassword={setPasswordRegister}
                    setEmail={setEmailRegister}
                    email={emailRegister}
                    scrollToPage={scrollToPage}
                    pageNumber={pageNumber}
                    setLoginModal={setLoginModal}
                    setGoogleData={setGoogleData}
                    setAppleData={setAppleData}
                />
                <SignUpBusiness
                    setRepeatPassword={setRepeatPasswordRegister}
                    repeatPassword={repeatPasswordRegister}
                    password={passwordRegister}
                    setPassword={setPasswordRegister}
                    setEmail={setEmailRegister}
                    email={emailRegister}
                    scrollToPage={scrollToPage}
                    pageNumber={pageNumber}
                    setLoginModal={setLoginModal}
                    googleData={googleData}
                    appleData={appleData}
                />
            </ScrollView>
            {/* Modal for Email Input */}
        </GestureHandlerRootView>
    );
};

export default Login;
