import {Image, ImageBackground, Pressable, StyleSheet, Text, View} from "react-native";
import {MEDIA_URL} from "../../../utils/CONST";

import Animated, {cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useEffect, useState} from "react";
import {shorterText} from "../../../utils/textFormating";

import LinearGradient from "react-native-linear-gradient";

import PAPER from "../../../assets/paper4.png";
import {router} from "expo-router";
import {saveCurrentVoucherMMKV} from "../../../MMKV/mmkvCustomer/vouchers";

const Voucher = ({voucher, index}) => {

    const [imageLoaded, setImageLoaded] = useState(false);


    const vouColors = [
        ["#fce38a", "#f38181"],
        ["#f54ea2", "#ff7676"],
        ["#17ead9", "#6078ea"],
        ["#42e695", "#3bb2b8"],
        ["#f02fc2", "#6094ea"],
        ["#fbd48b", "#f39781"],
        ["#eb4c7f", "#ed7d6e"],
        ["#16eabc", "#6e68dd"],
        ["#57e642", "#3ab894"],
        ["#f831a5", "#60a7ea"],
    ];

    const vouCLocations = [
        [0.2, 0.6],
        [0.33, 0.5],
        [0.22, 0.85],
        [0.15, 0.65],
        [0.36, 0.9],
        [0.4, 0.6],
    ];

    const [voucherColors, setVoucherColors] = useState(false);
    const [colorsLocations, setcColorsLocations] = useState(false);

    useEffect(() => {
        setVoucherColors(vouColors[Math.floor(Math.random() * vouColors.length)]);
        setcColorsLocations(vouCLocations[Math.floor(Math.random() * vouCLocations.length)]);
    }, []);

    // Animation configurations for image scaling and opacity
    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        if (imageLoaded) {
            setTimeout(() => {
                scale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
                opacity.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
            }, index * 50);
        }
        return () => {
            cancelAnimation(scale);
            cancelAnimation(opacity)
        };
    }, [imageLoaded]);

    return (
        <>
            {voucher.is_active ? (
                <Pressable
                    className="w-[100%]"
                    onPress={() => {
                        saveCurrentVoucherMMKV(voucher)
                        router.push(`homeCustomer/cardsView/voucher`);
                        // setIsVoucherView(true), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                    }}>
                    <Animated.View style={animatedStyle} className="w-full justify-center items-center flex">
                        <View className="w-full justify-center items-center  mb-3 mt-2 rounded-lg">
                            {voucherColors && (
                                <LinearGradient
                                    // colors={["#fa8da4", "#c58dfa", "#8d9efa"]}
                                    colors={voucherColors}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    locations={colorsLocations}
                                    style={{width: "100%", borderRadius: 7}}>
                                    <ImageBackground source={PAPER} resizeMode="cover"
                                                     onLoadEnd={() => setImageLoaded(true)} imageStyle={{opacity: 0.3}}>
                                        {/* <View className="w-[100%] flex-row  items-center rounded-md bg-white"> */}
                                        <View className="justify-between flex-row">
                                            <View className="flex-shrink">
                                                <View className="flex-row">
                                                    <View className="w-24 m-3">
                                                        {voucher.business_user_profile.logo ? (
                                                            <Image
                                                                source={{uri: `${MEDIA_URL}${voucher.business_user_profile.logo}`}}
                                                                className="w-24 h-24 rounded-md "
                                                                alt="qr code"
                                                            />
                                                        ) : (
                                                            <View
                                                                className="w-24 h-24 items-center justify-center bg-ship-gray-200 rounded-md">
                                                                <Text
                                                                    className="text-5xl font-semibold text-ship-gray-700">
                                                                    {voucher.business_user_profile.business_name.charAt(0).toUpperCase()}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>

                                                    <View className="py-2 justify-between">
                                                        <View className="w-full">
                                                            <Text
                                                                className="text-lg text-wrap font-semibold text-ship-gray-900">
                                                                {shorterText(voucher.business_user_profile.business_name, 13).toUpperCase()}
                                                            </Text>
                                                            <Text
                                                                className="text-xl font-extrabold  text-ship-gray-900">
                                                                {shorterText(voucher.campaign.name ? voucher.campaign.name : voucher.promotion.name, 11).toUpperCase()}
                                                            </Text>
                                                        </View>
                                                        <View className="w-full">
                                                            <Text className=" text-sm text-ship-gray-700 text-start">Valid
                                                                until {voucher.expiration_date}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>

                                            <View
                                                className="w-28 items-center justify-center bg-ship-gray-100 rounded-md">
                                                <View className="w-24 justify-center items-center">
                                                    <Image source={{uri: `${MEDIA_URL}${voucher.qr_code}`}}
                                                           className="w-24 h-24 rounded-md"></Image>
                                                </View>
                                            </View>
                                            <View
                                                className="w-4 h-4 bg-white rounded-full absolute top-[-8] right-[90]"></View>
                                            <View
                                                className="w-4 h-4 bg-white rounded-full absolute bottom-[-8] right-[90]"></View>
                                        </View>

                                    </ImageBackground>
                                </LinearGradient>
                            )}
                        </View>
                    </Animated.View>
                </Pressable>
            ) : (
                <View className="w-[100%]">
                    <Animated.View style={animatedStyle} className="w-full justify-center items-center flex">
                        <Text
                            className="w-full text-6xl absolute z-10 text-ship-gray-800 top-10 left-20 font-semibold tracking-widest">EXPIRED</Text>
                        <View className="w-full justify-center items-center  mb-3 mt-2 rounded-lg opacity-40">
                            {voucherColors && (
                                <LinearGradient
                                    // colors={["#fa8da4", "#c58dfa", "#8d9efa"]}
                                    colors={voucherColors}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    locations={colorsLocations}
                                    style={{width: "100%", borderRadius: 7}}>
                                    <ImageBackground source={PAPER} resizeMode="cover"
                                                     onLoadEnd={() => setImageLoaded(true)} imageStyle={{opacity: 0.4}}>
                                        {/* <View className="w-[100%] flex-row  items-center rounded-md bg-white"> */}
                                        <View className="justify-between flex-row">
                                            <View className="flex-shrink">
                                                <View className="flex-row">
                                                    <View className="w-24 m-3">
                                                        {voucher.business_user_profile.logo ? (
                                                            <Image
                                                                source={{uri: `${MEDIA_URL}${voucher.business_user_profile.logo}`}}
                                                                className="w-24 h-24 rounded-md "
                                                                alt="qr code"
                                                            />
                                                        ) : (
                                                            <View
                                                                className="w-24 h-24 items-center justify-center bg-ship-gray-200 rounded-md">
                                                                <Text
                                                                    className="text-5xl font-semibold text-ship-gray-700">
                                                                    {voucher.business_user_profile.business_name.charAt(0).toUpperCase()}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>

                                                    <View className="py-2 justify-between">
                                                        <View className="w-full">
                                                            <Text
                                                                className="text-lg text-wrap font-semibold text-ship-gray-900">
                                                                {shorterText(voucher.business_user_profile.business_name, 13).toUpperCase()}
                                                            </Text>
                                                            <Text
                                                                className="text-xl font-extrabold  text-ship-gray-900">
                                                                {shorterText(voucher.campaign.name ? voucher.campaign.name : voucher.promotion.name, 11).toUpperCase()}
                                                            </Text>
                                                        </View>
                                                        <View className="w-full">
                                                            <Text className=" text-sm text-ship-gray-700 text-start">Valid
                                                                until {voucher.expiration_date}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>

                                            <View
                                                className="w-28 items-center justify-center bg-ship-gray-100 rounded-md">
                                                <View className="w-24 justify-center items-center">
                                                    <Image source={{uri: `${MEDIA_URL}${voucher.qr_code}`}}
                                                           className="w-24 h-24 rounded-md"></Image>
                                                </View>
                                            </View>
                                            <View
                                                className="w-4 h-4 bg-white rounded-full absolute top-[-8] right-[90]"></View>
                                            <View
                                                className="w-4 h-4 bg-white rounded-full absolute bottom-[-8] right-[90]"></View>
                                        </View>

                                    </ImageBackground>
                                </LinearGradient>
                            )}
                        </View>
                    </Animated.View>
                </View>
            )}
        </>
    );
};

export default Voucher;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 7.84,
        elevation: 10,
    },
    dottedLine: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#dfdfdf",
        borderRadius: 1,
    },
});
