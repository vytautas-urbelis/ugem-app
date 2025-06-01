import {
    ActivityIndicator,
    Dimensions,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Animated, {useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing} from "react-native-reanimated";
import {useEffect, useState} from "react";
// import CollectorView from "./collectorView";

import * as Haptics from "expo-haptics";

import {Modal, SlideAnimation} from "react-native-modals";
import {colors} from "../../../constants/colors";
import {shorterText} from "../../../utils/textFormating";

import LinearGradient from "react-native-linear-gradient";
import {IssuePromotionVoucher} from "../../../axios/axiosCustomer/voucher";
import {authStorage} from "../../../MMKV/auth";
import PromotionView from "./promotionView";

import PAPER from "../../../assets/paper.png";
import {saveCurrentVoucherMMKV} from "../../../MMKV/mmkvCustomer/vouchers";
import {router} from "expo-router";

const ActivePromotion = ({businessProfile, promotion, promotions, setPromotions, index}) => {
    const [isPromotionView, setIsPromotionView] = useState(false);
    const [imageLoad, setImageLoad] = useState(true);
    const [issuingVoucher, setIssuingVoucher] = useState(false);

    const accessToken = authStorage.getString("accessToken");
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

    const colColors = ["#fce38a", "#f3b281", "#f3b281"];
    // const vouColors = [
    //   ["#fce38a", "#f38181"],
    //   ["#f54ea2", "#ff7676"],
    //   ["#17ead9", "#6078ea"],
    //   ["#42e695", "#3bb2b8"],
    //   ["#f02fc2", "#6094ea"],
    //   ["#fbd48b", "#f39781"],
    //   ["#eb4c7f", "#ed7d6e"],
    //   ["#16eabc", "#6e68dd"],
    //   ["#57e642", "#3ab894"],
    //   ["#f831a5", "#60a7ea"],
    // ];

    const getGem = async () => {
        setIssuingVoucher(true);
        try {
            const res = await IssuePromotionVoucher(promotion.id, accessToken);
            setTimeout(() => {
                const updatedPromotions = promotions.map((pro) => {
                    if (pro.id === promotion.id) {
                        return res.promotion;
                    }
                });
                setPromotions(updatedPromotions);

                setIssuingVoucher(false);
            }, 1000);
        } catch (error) {
        } finally {
            setIsPromotionView(false);
        }
    };

    return (
        <>
            <Modal
                style={{zIndex: 2}}
                visible={isPromotionView}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <PromotionView
                    businessProfile={businessProfile}
                    promotion={promotion}
                    setIsPromotionView={setIsPromotionView}
                    colColors={colColors}
                />
            </Modal>
            <Pressable
                onPress={() => {
                    setIsPromotionView(true), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                }}>
                <Animated.View style={animatedStyle} className="flex-1 justify-center items-center flex w-full">
                    <View className="w-full justify-center items-center  mb-5 mt-1">
                        <LinearGradient
                            colors={colColors}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            locations={[0.33, 0.6, 0.7]}
                            style={{width: "100%", justifyContent: "center", borderRadius: 7}}>
                            {/*<ImageBackground*/}
                            {/*  className=" w-full rounded-lg"*/}
                            {/*  source={PAPER}*/}
                            {/*  resizeMode="cover"*/}
                            {/*  onLoadEnd={() => setImageLoad(true)}*/}
                            {/*  imageStyle={{ opacity: 0.2 }}>*/}
                            <View className="w-full min-h-32">
                                <View className="flex-row w-full">
                                    <View className="flex-row ">
                                        <View className="w-full h-full py-3 px-3 justify-between">
                                            <View>
                                                <Text className="text-xl font-extrabold  text-ship-gray-900">
                                                    {shorterText(promotion.name, 24).toUpperCase()}
                                                </Text>
                                                <Text
                                                    className="text-base  text-ship-gray-900">{promotion.description} </Text>
                                            </View>

                                            <View className="w-full mt-2 flex-row justify-between items-end">
                                                <Text className="text-sm text-ship-gray-500">Promotion
                                                    ends: {promotion.date_ends}</Text>
                                                <TouchableOpacity onPress={() => getGem()}
                                                                  className="bg-[#fce38a] p-1 px-3 rounded-lg flex-row">
                                                    <Text className="text-lg text-ship-gray-900">Get Voucher</Text>
                                                    {issuingVoucher && (
                                                        <View className="pl-2 items-center justify-center">
                                                            <ActivityIndicator/>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="w-18 h-full items-center justify-center pr-5"></View>
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

export default ActivePromotion;

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
