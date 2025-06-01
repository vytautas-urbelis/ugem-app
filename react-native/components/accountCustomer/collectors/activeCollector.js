import {Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, View} from "react-native";
import {MEDIA_URL} from "../../../utils/CONST";

import Animated, {cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useEffect, useState} from "react";

import {getCustomerMMKV} from "../../../MMKV/mmkvCustomer/user";
import {colors} from "../../../constants/colors";
import {shorterText} from "../../../utils/textFormating";

import LinearGradient from "react-native-linear-gradient";

import * as Progress from "react-native-progress";

import PAPER from "../../../assets/paper.png";
import {saveCurrentCollectorMMKV} from "../../../MMKV/mmkvCustomer/collectors";
import {router} from "expo-router";

const Collector = ({collector, index}) => {
    customerUser = getCustomerMMKV() ? getCustomerMMKV() : null;

    const [imageLoaded, setImageLoaded] = useState(false);

    const widthCollector = Math.round(Dimensions.get("window").width * 0.56 - 28);

    const collectorType = collector.campaign.collector_type;

    const [progressPercent, setProgressPercent] = useState(0);

    const colColors = ["#81c5f3", "#81a1f3", "#8190f3"];


    useEffect(() => {
        setProgressPercent(collector.value_counted / collector.value_goal);
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

    const renderRoundObjects = () => {
        let roundObjects = [];
        for (let i = 0; i < collector.value_goal; i++) {
            roundObjects.push(
                <View key={i}>
                    {i < collector.value_counted ? (
                        <View
                            className=" h-3 w-3 rounded-full m-1 items-center justify-center"
                            key={`colId-${collector.id}-collected-nr-${i}`}
                            style={{backgroundColor: colors["moody-blue"]["500"]}}>
                        </View>
                    ) : (
                        <View
                            className=" h-3 w-3 rounded-full m-1 items-center justify-center"
                            key={`colId-${collector.id}-uncollected-nr-${i}`}
                            style={{backgroundColor: colors["moody-blue"]["200"]}}>
                        </View>
                    )}
                </View>,
            );
        }
        return roundObjects;
    };

    return (
        <>

            {collector.is_active ? (
                <Pressable
                    onPress={() => {
                        saveCurrentCollectorMMKV(collector)
                        router.push(`homeCustomer/cardsView/collector`);
                    }}>
                    <Animated.View style={animatedStyle} className="flex-1 justify-center items-center flex w-full">
                        <View className="w-full justify-center items-center  mb-5 mt-1">
                            <LinearGradient
                                colors={colColors}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                locations={[0.33, 0.6, 0.7]}
                                style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    borderTopLeftRadius: 7,
                                    borderBottomLeftRadius: 7
                                }}>
                                <ImageBackground
                                    source={PAPER}
                                    resizeMode="cover"
                                    onLoadEnd={() => setImageLoaded(true)}
                                    imageStyle={{opacity: 0.2}}>
                                    <View className="flex-row justify-between w-full">
                                        <View className="w-full justify-between">
                                            <View className="flex-row  w-full items-start justify-between">
                                                <View className="flex-row w-full justify-between">
                                                    <View className="flex-row">
                                                        <View className="w-24 m-3">
                                                            {collector.business_user_profile.logo ? (
                                                                <Image
                                                                    source={{uri: `${MEDIA_URL}${collector.business_user_profile.logo}`}}
                                                                    className="w-24 h-24 rounded-md "
                                                                    alt="qr code"
                                                                />
                                                            ) : (
                                                                <View
                                                                    className="w-24 h-24 items-center justify-center bg-ship-gray-200 rounded-md">
                                                                    <Text
                                                                        className="text-5xl font-semibold text-ship-gray-700">
                                                                        {collector.business_user_profile.business_name.charAt(0).toUpperCase()}
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                        <View style={{width: widthCollector}} className=" py-3 pl-3 ">
                                                            {/* <View className="flex-wrap justify-start"> */}
                                                            <Text
                                                                className="text-lg text-wrap font-semibold text-ship-gray-900">
                                                                {shorterText(collector.business_user_profile.business_name, 14).toUpperCase()}
                                                            </Text>
                                                            {/* </View> */}
                                                            <Text
                                                                className="text-xl font-extrabold  text-ship-gray-900">
                                                                {shorterText(collector.campaign.name, 12).toUpperCase()}
                                                            </Text>
                                                            <View className="mt-4 w-full ">
                                                                <Text className="text-sm text-ship-gray-700">
                                                                    <Text
                                                                        className="font-semibold text-ship-gray-700">{collector.value_counted}</Text> out
                                                                    of{" "}
                                                                    <Text
                                                                        className="font-semibold text-ship-gray-700">{collector.value_goal}</Text>
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View className="w-18 h-full items-center justify-center pr-5">
                                                        {collectorType === 1 ? (
                                                            <View
                                                                className="w-16 h-full items-start flex-row flex-wrap pt-3">{renderRoundObjects()}</View>
                                                        ) : (
                                                            <>
                                                                <Progress.Circle
                                                                    size={52}
                                                                    indeterminate={false}
                                                                    progress={progressPercent}
                                                                    borderWidth={0}
                                                                    unfilledColor={colors["moody-blue"]["200"]}
                                                                    color={colors["moody-blue"]["500"]}
                                                                    thickness={7}
                                                                    showsText
                                                                    textStyle={{
                                                                        color: colors["moody-blue"]["200"],
                                                                        fontSize: 12
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View
                                            className="w-20 h-20 bg-white rounded-full absolute top-5 right-[-58]"></View>
                                    </View>
                                </ImageBackground>
                            </LinearGradient>
                        </View>
                    </Animated.View>
                </Pressable>
            ) : (
                <Pressable className="w-full">
                    <Animated.View style={animatedStyle} className="flex-1 justify-center items-center flex w-full">
                        <Text
                            className="w-full text-6xl absolute z-10 text-ship-gray-800 top-10 left-20 font-semibold tracking-widest">EXPIRED</Text>
                        <View className="w-full justify-center items-center  mb-5 mt-1  opacity-40">
                            <LinearGradient
                                colors={colColors}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                locations={[0.33, 0.6, 0.7]}
                                style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    borderTopLeftRadius: 7,
                                    borderBottomLeftRadius: 7
                                }}>
                                <ImageBackground
                                    // className="items-center justify-center bg-white rounded-lg px-6  border border-ship-gray-200"
                                    source={PAPER}
                                    resizeMode="cover"
                                    onLoadEnd={() => setImageLoaded(true)}
                                    imageStyle={{opacity: 0.4}}>
                                    {/* <View className="w-[100%] flex items-center  rounded-lg bg-white"> */}
                                    <View className="flex-row justify-between w-full">
                                        <View className="w-full justify-between">
                                            <View className="flex-row  w-full items-start justify-between">
                                                <View className="flex-row w-full justify-between">
                                                    <View className="flex-row">
                                                        <View className="w-24 m-3">
                                                            {collector.business_user_profile.logo ? (
                                                                <Image
                                                                    source={{uri: `${MEDIA_URL}${collector.business_user_profile.logo}`}}
                                                                    className="w-24 h-24 rounded-md "
                                                                    alt="qr code"
                                                                />
                                                            ) : (
                                                                <View
                                                                    className="w-24 h-24 items-center justify-center bg-ship-gray-200 rounded-md">
                                                                    <Text
                                                                        className="text-5xl font-semibold text-ship-gray-700">
                                                                        {collector.business_user_profile.business_name.charAt(0).toUpperCase()}
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                        <View style={{width: widthCollector}} className=" py-3 pl-3 ">
                                                            {/* <View className="flex-wrap justify-start"> */}
                                                            <Text
                                                                className="text-lg text-wrap font-semibold text-ship-gray-900">
                                                                {shorterText(collector.business_user_profile.business_name, 14).toUpperCase()}
                                                            </Text>
                                                            {/* </View> */}
                                                            <Text
                                                                className="text-xl font-extrabold  text-ship-gray-900">
                                                                {shorterText(collector.campaign.name, 12).toUpperCase()}
                                                            </Text>
                                                            <View className="mt-4 w-full ">
                                                                <Text className="text-sm text-ship-gray-700">
                                                                    <Text
                                                                        className="font-semibold text-ship-gray-700">{collector.value_counted}</Text> out
                                                                    of{" "}
                                                                    <Text
                                                                        className="font-semibold text-ship-gray-700">{collector.value_goal}</Text>
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View className="w-18 h-full items-center justify-center pr-5">
                                                        {collectorType === 1 ? (
                                                            <View
                                                                className="w-16 h-full items-start flex-row flex-wrap pt-3">{renderRoundObjects()}</View>
                                                        ) : (
                                                            <>
                                                                <Progress.Circle
                                                                    size={52}
                                                                    indeterminate={false}
                                                                    progress={progressPercent}
                                                                    borderWidth={0}
                                                                    unfilledColor={colors["moody-blue"]["200"]}
                                                                    color={colors["moody-blue"]["500"]}
                                                                    thickness={7}
                                                                    showsText
                                                                    textStyle={{
                                                                        color: colors["moody-blue"]["200"],
                                                                        fontSize: 12
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View
                                            className="w-20 h-20 bg-ship-gray-100 rounded-full absolute top-5 right-[-58]"></View>
                                    </View>
                                </ImageBackground>
                            </LinearGradient>
                        </View>
                    </Animated.View>
                </Pressable>
            )}
        </>
    );
};

export default Collector;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 7.84,
        elevation: 10,
    },
    container: {
        flexDirection: "row", // Adjust this if you want a different layout
        flexWrap: "wrap", // Allows the items to wrap onto multiple lines
        margin: 10,
    },
    roundObject: {
        width: 20, // Adjust the size of the round objects
        height: 20,
        borderRadius: 10, // Half of width and height to make it round
        margin: 5, // Space between the round objects
    },
    dottedLine: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors["ship-gray"]["100"],
        borderRadius: 1,
    },
    screenWidth: {
        width: Dimensions.get("window").width,
    },
});
