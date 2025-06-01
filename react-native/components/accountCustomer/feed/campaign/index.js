import {Text, View} from "react-native";

import Animated, {cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useEffect, useState} from "react";
// import CollectorView from "./campaignView";
import {colors} from "../../../../constants/colors";
import {shorterText} from "../../../../utils/textFormating";

import LinearGradient from "react-native-linear-gradient";

import * as Progress from "react-native-progress";
import PostHeader from "../postHeader";
import {saveCurrentCampaignMMKV} from "../../../../MMKV/mmkvCustomer/campaigns";
import {router} from "expo-router";
import {Pressable} from "react-native-gesture-handler";
// import CampaignView from "./campaignView";

const FeedCampaign = ({openBusinessProfile, item, index, currentLocation, toggleFollow}) => {
    const [isCampaignView, setIsCampaignView] = useState(false);

    const collectorType = item.data.collector_type;

    const colColors = ["#81c5f3", "#81a1f3", "#8190f3"];
    // const colColors = ["#16eabc", "#16eabc", "#6e68dd"];
    // const colColors = [colors["shamrock"]["200"], colors["shamrock"]["300"], colors["shamrock"]["400"]];
    // const colColors = [colors["moody-blue"]["300"], colors["moody-blue"]["100"], colors["moody-blue"]["50"]];

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
        setTimeout(() => {
            scale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
            opacity.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
        }, index * 100);

        return () => {
            cancelAnimation(scale);
            cancelAnimation(opacity)
        };
    }, []);

    const renderRoundObjects = () => {
        let roundObjects = [];
        for (let i = 0; i < item.data.value_goal; i++) {
            roundObjects.push(
                <View
                    className=" h-3 w-3 rounded-full m-1 items-center justify-center"
                    key={`${item.data.id}-${i}`}
                    style={{backgroundColor: colors["moody-blue"]["300"]}}>
                    {/* <Image source={CHECKED} className="w-2 h-2 opacity-20"></Image> */}
                </View>,
            );
        }
        return roundObjects;
    };

    return (
        <Animated.View style={animatedStyle} className="w-full mb-8  border-b pb-4 border-ship-gray-100">
            {/* <Text>{item.item_type}</Text> */}
            <View className="flex-row gap-2 items-start  mb-2">
                <PostHeader
                    businessProfile={item.data.business_user_profile}
                    distance={item.distance}
                    openBusinessProfile={openBusinessProfile}
                    currentLocation={currentLocation}
                    toggleFollow={toggleFollow}
                />
            </View>

            <Pressable
                className="flex"
                onPress={() => {
                    saveCurrentCampaignMMKV(item.data)
                    router.push('homeCustomer/cardsView/activeCampaign')
                }}>
                {/*<View className="w-12"></View>*/}
                <View className="justify-center items-center flex-shrink  border-4 border-moody-blue-400 rounded-xl">
                    <View className="w-full justify-center items-center">

                        <LinearGradient
                            colors={colColors}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            locations={[0.33, 0.6, 0.7]}
                            style={{width: "100%", justifyContent: "center", borderRadius: 6}}>
                            {/*<ImageBackground source={PAPER} resizeMode="cover" imageStyle={{opacity: 0.14}}>*/}
                            <View className="flex-row  w-full items-center justify-between min-h-36">
                                <View className="flex-row w-[65%] h-full">
                                    <View className="w-full py-3 pl-3 justify-between">
                                        <View>
                                            <Text
                                                className="text-xl font-extrabold  text-ship-gray-900">{shorterText(item.data.name, 16).toUpperCase()}</Text>
                                            <Text
                                                className="text-base  text-ship-gray-900">{item.data.description} </Text>
                                        </View>

                                        <View className="w-full mt-2">
                                            <Text className="text-sm text-ship-gray-700">Campaign
                                                ends: {item.data.ending_date}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="w-26 items-end justify-center pr-3 ">

                                    {collectorType === 1 ? (
                                        <>
                                            <View
                                                className="w-20 h-32 bg-moody-blue-100 rounded-lg items-center justify-start ">
                                                <Text
                                                    className={"text-xs font-semibold text-moody-blue-400 my-1"}>Campaign</Text>
                                                <View
                                                    className="w-16 items-center justify-center flex-row flex-wrap ">{renderRoundObjects()}</View></View>

                                        </>
                                    ) : (
                                        <View
                                            className="w-20 h-32 bg-moody-blue-100 rounded-lg items-center justify-start ">
                                            <Text
                                                className={"text-xs font-semibold text-moody-blue-400 my-1"}>Campaign</Text>

                                            {/* <View className="w-full items-center flex "> */}
                                            <View className=" items-center w-20">
                                                <Text
                                                    className=" text-xl font-bold  text-moody-blue-300 text-start mb-2">
                                                    {item.data.value_goal}
                                                </Text>
                                                {/*<Text*/}
                                                {/*    className=" text-base font-bold  text-moody-blue-300 text-start">points</Text>*/}
                                                <Progress.Circle
                                                    size={50}
                                                    indeterminate={false}
                                                    progress={0}
                                                    borderWidth={0}
                                                    unfilledColor={colors["moody-blue"]["300"]}
                                                    color={colors["moody-blue"]["500"]}
                                                    thickness={8}
                                                    textStyle={{
                                                        color: colors["moody-blue"]["500"],
                                                        fontSize: 24
                                                    }}
                                                />
                                            </View>

                                        </View>
                                    )}
                                </View>
                            </View>
                            {/*</ImageBackground>*/}
                        </LinearGradient>

                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
};

export default FeedCampaign;

