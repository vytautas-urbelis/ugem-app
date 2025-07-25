import React, {useEffect, useState} from "react";
import {Dimensions, Text, TouchableOpacity, View} from "react-native";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {getCustomerMMKV} from "../../MMKV/mmkvCustomer/user";
import SaveLoader from "../smallComponents/smLoader";
import AUTH from "../../assets/svg/Authentication.svg";
import {BaseButton, GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomModal, SlideAnimation} from "react-native-modals";
import CustomerConfSendVerLink from "./confResendVerLinkCustomer";

const VerifyUser = ({email, handelIsVerified, handelVerifyUser, anError, loader, setVerifyUserModal, setLater}) => {
    const [loading, setLoading] = useState(false);
    const [isSendVerLink, setIsSendVerLink] = useState(false);

    const customerUser = getCustomerMMKV() ? getCustomerMMKV() : null;
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    const imageWidth = Dimensions.get("window").width * 0.8

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
            opacity: opacity.value,
        };
    });

    useEffect(() => {

        // Add a delay of 300ms before starting the animation
        setTimeout(() => {
            scale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
            opacity.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
        }, 300); // 300ms delay

    }, []);

    return (
        <GestureHandlerRootView>
            <View className="w-screen flex-1 mt-10 p-4">
                <Animated.View style={animatedStyle} className="flex-1 justify-between items-center flex">
                    <View className="w-full items-center">

                        <AUTH width={imageWidth} height={imageWidth}/>
                        <View className="w-10/12 justify-center items-center">
                            <Text className="text-2xl text-center  text-ship-gray-800 mb-4">
                                Please check your email for the verification link.
                            </Text>

                            <Text className="text-lg text-center  text-ship-gray-800 ">
                                If you can't find the link, or if it has expired, please press the button below to
                                resend the verification link.
                            </Text>
                        </View>
                        <View className="mt-7 w-10/12 justify-center items-center">
                            <Text className="text-xl"></Text>
                        </View>
                        {loading ?
                            <View
                                className="w-full h-16 rounded-lg bg-ship-gray-900 items-center justify-center opacity-60">
                                <BaseButton
                                    className="mt-7"
                                    onPress={() => {

                                    }}>
                                    <SaveLoader/>
                                </BaseButton>
                            </View> :
                            <View className="w-full h-16 rounded-lg bg-ship-gray-900 items-center justify-center">
                                <BaseButton
                                    className="mt-7"
                                    onPress={() => {
                                        setIsSendVerLink(true);
                                        setLoading(true);
                                    }}>
                                    <Text className="text-center w-full p-5 text-white font-semibold text-xl">Send
                                        verification link</Text>
                                </BaseButton>
                            </View>}

                    </View>

                    <TouchableOpacity
                        className="mb-16"
                        onPress={() => {
                            setVerifyUserModal(false), setLater(true);
                        }}>
                        <Text className="text-lg text-blue-700">Remind me later</Text>
                    </TouchableOpacity>
                </Animated.View>
                {/* Log Out Confirmation Modal */}
                <BottomModal
                    style={{zIndex: 2}}
                    visible={isSendVerLink}
                    modalAnimation={
                        new SlideAnimation({
                            slideFrom: "bottom",
                        })
                    }>
                    <CustomerConfSendVerLink setIsSendVerLink={setIsSendVerLink} setVerifyUserModal={setVerifyUserModal}
                                             setLoading={setLoading}/>
                </BottomModal>
            </View>
        </GestureHandlerRootView>
    );
};

export default VerifyUser;
