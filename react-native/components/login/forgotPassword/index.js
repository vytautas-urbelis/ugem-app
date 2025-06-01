import {Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {TextInputComponent} from "../../smallComponents/textInput";
import {SubmitButtonNew} from "../../smallComponents/buttons";
import React, {useEffect, useState} from "react";
import {BusinessResgister, RecoverPassword} from "../../../axios/axiosBusiness/businessAuth";
import * as Haptics from "expo-haptics";
import {validateEmail} from "../../../utils/auth";
import Animated from "react-native-reanimated";
import UGEM from "../../../assets/svg/uGem.svg";
import {colors} from "../../../constants/colors";
import SaveLoader from "../../smallComponents/smLoader";

const ForgotPassword = ({setForgotPasswordUpModal, setLoginModal}) => {
    // State hooks for managing form data, errors, and UI loading states
    const [loader, setLoader] = useState(false); // Loader state for handling loading UI
    const [error, setError] = useState(""); // Error message state

    const [email, setEmail] = useState(null); // Email input state

    // // Check if the email is valid
    // const validateEmail = () => {
    //   // Regular expression to check for a valid email format
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (!emailRegex.test(email)) {
    //     setError("Please provide a valid email address.");
    //     return false;
    //   }
    //   setError("");
    //   return true;
    // };

    // Handle registration form submission
    const handlePasswordRecovery = async () => {
        setLoader(true); // Show loader
        try {
            setError("");
            if (validateEmail(email, setError)) {
                try {
                    // Call API to send password recovery email
                    await RecoverPassword(email);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setForgotPasswordUpModal(false);
                    setLoginModal(true);
                } catch (error) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    console.log(error.response.data);
                    if (error.response.data === "No active account found with the given email.") {
                        return setError("No active account found with the given email.");
                    }
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
        <>
            <ScrollView className="h-screen w-screen p-6 ">
                {/* Form Container */}
                <View className={'justify-center items-center w-full h-screen'}>
                    <Animated.View className="w-full max-w-[600] mt-14">


                        <View className="w-full items-center mb-12">
                            <UGEM width={200} height={36} fill={colors.zest["400"]}/>
                        </View>
                        <View className="mb-5">
                            <Text className="pb-4 mb-4 text-center text-ship-gray-900  text-xl">
                                Password recovery link will be sent to your email.
                            </Text>
                        </View>

                        {/* Input fields for signup */}
                        <View className="mb-3 w-full">
                            <TextInput
                                style={{borderColor: colors["ship-gray"]["200"]}}
                                className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white"
                                inputMode={"email"}
                                autoCapitalize='none'

                                onChangeText={(text) => setEmail(text)}
                            />
                            <Text
                                className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Email
                                address
                            </Text>
                        </View>

                        {error ? <Text className="text-center w-full text-red-500 text-lg">{error}</Text> : null}

                        {/* Submit button */}
                        <TouchableOpacity
                            disabled={loader}
                            onPress={handlePasswordRecovery}
                            className="w-full rounded-lg bg-ship-gray-900 items-center justify-center mt-3">
                            {loader ? (
                                <View className="p-5">
                                    <SaveLoader/>
                                </View>
                            ) : (
                                <Text className="text-center w-full p-5 text-white font-semibold text-xl">Send
                                    link</Text>
                            )}
                        </TouchableOpacity>
                        <View className="border-b border-ship-gray-300 items-center justify-center my-8">
                        </View>
                        <TouchableOpacity className="w-full items-center justify-center"
                                          onPress={() => {
                                              setForgotPasswordUpModal(false), setLoginModal(true)
                                          }}>
                            <Text className="font-normal text-gray-900">
                                Go back
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>


        </>
    );
};

export default ForgotPassword;

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
