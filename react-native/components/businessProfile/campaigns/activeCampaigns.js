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

import Animated, {useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing} from "react-native-reanimated";
import {useEffect, useState} from "react";
// import CollectorView from "./campaignView";

import * as Haptics from "expo-haptics";

import {getCustomerMMKV} from "../../../MMKV/mmkvCustomer/user";
import {Modal, SlideAnimation} from "react-native-modals";
import {colors} from "../../../constants/colors";
import {shorterText} from "../../../utils/textFormating";

import LinearGradient from "react-native-linear-gradient";

import * as Progress from "react-native-progress";
import CampaignView from "./campaignView";

import PAPER from "../../../assets/paper.png";
import {saveCurrentCampaignMMKV} from "../../../MMKV/mmkvCustomer/campaigns";
import {router} from "expo-router";

const ActiveCampaign = ({campaign, index}) => {
    customerUser = getCustomerMMKV() ? getCustomerMMKV() : null;

    const collectorType = campaign.collector_type;

    const [isCampaignView, setIsCampaignView] = useState(false);
    const [imageLoad, setImageLoad] = useState(true);

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

    const colColors = ["#81c5f3", "#81a1f3", "#8190f3"];

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
        for (let i = 0; i < campaign.value_goal; i++) {
            roundObjects.push(
                <View
                    className=" h-3 w-3 rounded-full m-1 items-center justify-center"
                    key={`${campaign.id}-${i}`}
                    style={{backgroundColor: colors["moody-blue"]["200"]}}>
                    {/* <Image source={CHECKED} className="w-2 h-2 opacity-20"></Image> */}
                </View>,
            );
        }
        return roundObjects;
    };

    return (
        <>
            {/*<Modal*/}
            {/*  style={{ zIndex: 2 }}*/}
            {/*  visible={isCampaignView}*/}
            {/*  modalAnimation={*/}
            {/*    new SlideAnimation({*/}
            {/*      slideFrom: "bottom",*/}
            {/*    })*/}
            {/*  }>*/}
            {/*  <CampaignView campaign={campaign} colColors={colColors} setIsCampaignView={setIsCampaignView} />*/}
            {/*</Modal>*/}
            <Pressable
                onPress={() => {
                    saveCurrentCampaignMMKV(campaign)
                    router.push('homeCustomer/cardsView/activeCampaign')
                }}>
                <Animated.View style={animatedStyle} className="flex-1 justify-center items-center flex w-full ">
                    <View className="w-full justify-center items-center  mb-5 mt-1">
                        <LinearGradient
                            colors={colColors}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            locations={[0.33, 0.6, 0.7]}
                            style={{width: "100%", justifyContent: "center", borderRadius: 7}}>
                            {/*<ImageBackground*/}
                            {/*    className=" w-full rounded-lg"*/}
                            {/*    source={PAPER}*/}
                            {/*    resizeMode="cover"*/}
                            {/*    onLoadEnd={() => setImageLoad(true)}*/}
                            {/*    imageStyle={{opacity: 0.2}}>*/}
                            <View className="flex-row  w-full items-start justify-between min-h-32">
                                <View className="flex-row w-[65%]">
                                    <View className="w-full h-full py-3 pl-3 justify-between">
                                        <View>
                                            <Text
                                                className="text-xl font-extrabold  text-ship-gray-900">{shorterText(campaign.name, 20).toUpperCase()}</Text>
                                            <Text
                                                className="text-base  text-ship-gray-900">{campaign.description} </Text>
                                        </View>

                                        <View className="w-full mt-2">
                                            <Text className="text-sm text-ship-gray-700">Campaign
                                                ends: {campaign.ending_date}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="w-26 h-full items-center justify-center pr-5">
                                    {collectorType === 1 ? (
                                        <>
                                            <View
                                                className="w-16 items-center flex-row flex-wrap">{renderRoundObjects()}</View>
                                        </>
                                    ) : (
                                        <View className="w-20 items-center">
                                            <>
                                                <View className="w-full items-center flex mt-2">
                                                    <View className="w-full items-center ">
                                                        <Progress.Circle
                                                            size={80}
                                                            indeterminate={false}
                                                            progress={0}
                                                            borderWidth={0}
                                                            unfilledColor={colors["moody-blue"]["200"]}
                                                            color={colors["moody-blue"]["500"]}
                                                            thickness={10}
                                                            textStyle={{
                                                                color: colors["moody-blue"]["500"],
                                                                fontSize: 24
                                                            }}
                                                        />
                                                        <Text
                                                            className=" text-xl font-bold top-[20] text-moody-blue-100 text-start absolute">
                                                            {campaign.value_goal}
                                                        </Text>
                                                        <Text
                                                            className=" text-lg font-bold top-[36] text-moody-blue-100 text-start absolute">Gems</Text>
                                                    </View>
                                                </View>
                                            </>
                                        </View>
                                    )}
                                </View>
                            </View>
                            {/*</ImageBackground>*/}
                        </LinearGradient>
                    </View>
                </Animated.View>
            </Pressable>
        </>
    );
};

export default ActiveCampaign;

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
