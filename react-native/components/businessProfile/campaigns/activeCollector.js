import {
    Dimensions,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {MEDIA_URL} from "../../../utils/CONST";

import Animated, {useSharedValue, useAnimatedStyle, withSpring, Easing, withTiming} from "react-native-reanimated";
import {useEffect, useState} from "react";
// import CollectorView from "./collectorView";

import * as Haptics from "expo-haptics";

import {Modal, SlideAnimation} from "react-native-modals";
import {colors} from "../../../constants/colors";
import {shorterText} from "../../../utils/textFormating";

import LinearGradient from "react-native-linear-gradient";

import * as Progress from "react-native-progress";
import ActiveCollectorView from "./collectorView";

import PAPER from "../../../assets/paper.png";
import {saveCurrentCampaignMMKV} from "../../../MMKV/mmkvCustomer/campaigns";
import {router} from "expo-router";

const ActiveCollector = ({campaign, index, setIsBusinessProfile}) => {
    const widthCollector = Math.round(Dimensions.get("window").width * 0.56 - 28);

    const collectorType = campaign.collector_type;

    const [isCollectorView, setIsCollectorView] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [imageLoad, setImageLoad] = useState(true);

    // Setting collectors colors
    // const colColors = ["#b1e9cb", "#7ed7ad", "#6de2d5"];
    // const colColors = ["#7ed7c3", "#7ed7b4", "#7ed7a0"];

    //["#f54ea2", "#ff7676"],
    const colColors = ["#81c5f3", "#81a1f3", "#8190f3"];

    // const progressPercent = collector.value_counted / collector.value_goal

    useEffect(() => {
        setProgressPercent(campaign.collector.value_counted / campaign.collector.value_goal);
    }, []);

    // // Animation configurations for image scaling and opacity
    // const scale = useSharedValue(0.95);
    // const translateY = useSharedValue(800);

    // const animatedStyle = useAnimatedStyle(() => {
    //   return {
    //     transform: [{ scale: scale.value }],
    //     transform: [{ translateY: translateY.value }],
    //   };
    // });

    // // Trigger animation when image is loaded
    // useEffect(() => {
    //   // Delay the animation of each item based on its index
    //   setTimeout(() => {
    //     scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
    //     translateY.value = withSpring(0, { damping: 1500, stiffness: 100 });
    //   }, index * 100);
    // }, []);

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
    }, []);

    const renderRoundObjects = () => {
        let roundObjects = [];
        for (let i = 0; i < campaign.collector.value_goal; i++) {
            roundObjects.push(
                <View key={`id-${campaign.id}-nr-${i}`}>
                    {i < campaign.collector.value_counted ? (
                        <View
                            className=" h-3 w-3 rounded-full m-1 items-center justify-center"
                            key={`colId-${campaign.id}-collected-nr-${i}`}
                            style={{backgroundColor: colors["moody-blue"]["500"]}}>
                            {/* <Image source={CHECKED} className="w-2 h-2"></Image> */}
                        </View>
                    ) : (
                        <View
                            className=" h-3 w-3 rounded-full m-1 items-center justify-center"
                            key={`colId-${campaign.id}-uncollected-nr-${i}`}
                            style={{backgroundColor: colors["moody-blue"]["200"]}}>
                            {/* <Image source={CHECKED} className="w-2 h-2 opacity-20"></Image> */}
                        </View>
                    )}
                </View>,
            );
        }
        return roundObjects;
    };

    return (
        <>
            <Modal
                style={{zIndex: 2}}
                visible={isCollectorView}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <ActiveCollectorView colColors={colColors} campaign={campaign} setIsCollectorView={setIsCollectorView}/>
            </Modal>
            <Pressable
                onPress={() => {
                    saveCurrentCampaignMMKV(campaign)
                    router.push('homeCustomer/cardsView/activeCollector')
                    // setIsCollectorView(true), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
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
                            {/*<ImageBackground*/}
                            {/*    className=" w-full rounded-lg"*/}
                            {/*    source={PAPER}*/}
                            {/*    resizeMode="cover"*/}
                            {/*    onLoadEnd={() => setImageLoad(true)}*/}
                            {/*    imageStyle={{opacity: 0.2}}>*/}
                            <View className="w-full">
                                <View className="flex-row w-full">
                                    <View className="w-24 m-3">
                                        {campaign.business_user_profile.logo ? (
                                            <Image source={{uri: `${campaign.business_user_profile.logo}`}}
                                                   className="w-24 h-24 rounded-md " alt="qr code"/>
                                        ) : (
                                            <View
                                                className="w-24 h-24 items-center justify-center bg-ship-gray-200 rounded-md">
                                                <Text className="text-5xl font-semibold text-ship-gray-700">
                                                    {campaign.business_user_profile.business_name.charAt(0).toUpperCase()}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={{width: widthCollector}} className="flex-shrink py-3">
                                        <Text className="text-lg text-wrap font-semibold text-ship-gray-900">
                                            {shorterText(campaign.business_user_profile.business_name, 14).toUpperCase()}
                                        </Text>
                                        <Text
                                            className="text-xl font-extrabold  text-ship-gray-900">{shorterText(campaign.name, 12).toUpperCase()}</Text>
                                        <View className="mt-4 w-full ">
                                            <Text className="text-sm text-ship-gray-700">
                                                <Text
                                                    className="font-semibold text-ship-gray-700">{campaign.collector.value_counted}</Text> out
                                                of{" "}
                                                <Text
                                                    className="font-semibold text-ship-gray-700">{campaign.collector.value_goal}</Text>
                                            </Text>
                                        </View>
                                    </View>
                                    {/* </View> */}

                                    <View className="w-18 h-full items-center justify-center pr-5">
                                        {collectorType === 1 ? (
                                            <View
                                                className="w-16 items-center flex-row flex-wrap">{renderRoundObjects()}</View>
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
                                                    textStyle={{color: colors["moody-blue"]["200"], fontSize: 12}}
                                                    // const colColors = ["#81c5f3", "#81a1f3", "#8190f3"]
                                                />
                                            </>
                                        )}
                                    </View>
                                </View>
                                <View className="w-20 h-20 bg-white rounded-full absolute top-5 right-[-58]"></View>
                            </View>
                            {/*</ImageBackground>*/}
                        </LinearGradient>
                    </View>
                </Animated.View>
            </Pressable>
        </>
    );
};

export default ActiveCollector;

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
