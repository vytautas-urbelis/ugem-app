import {ActivityIndicator, Text, View,} from "react-native";

import Animated, {cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useEffect, useState} from "react";
// import CollectorView from "./campaignView";
import {shorterText} from "../../../../utils/textFormating";

import LinearGradient from "react-native-linear-gradient";
import PostHeader from "../postHeader";
import {authStorage} from "../../../../MMKV/auth";
import {IssuePromotionVoucher} from "../../../../axios/axiosCustomer/voucher";
import {
    saveCurrentPromotionBusinessProfileMMKV,
    saveCurrentPromotionMMKV
} from "../../../../MMKV/mmkvCustomer/promotions";
import {router} from "expo-router";
import {Pressable, TouchableOpacity} from "react-native-gesture-handler";
import QRCODE from '../../../../assets/svg/qrcode.svg'

const FeedPromotion = ({openBusinessProfile, item, index, currentLocation, toggleFollow}) => {
    const colColors = ["#fce38a", "#f3b281", "#f3b281"];
    const [isPromotionView, setIsPromotionView] = useState(false);
    const [issuingVoucher, setIssuingVoucher] = useState(false);
    const [promotion, setPromotion] = useState();

    const accessToken = authStorage.getString("accessToken");

    useEffect(() => {
        if (item) {
            setPromotion(item.data);
        }
    }, [item]);

    const getGem = async () => {
        setIssuingVoucher(true);
        try {
            const res = await IssuePromotionVoucher(promotion.id, accessToken);
            setTimeout(() => {
                let updatedPromotion = {...promotion};
                updatedPromotion.have_this_voucher = res.promotion.have_this_voucher;
                setPromotion(updatedPromotion);
                setIssuingVoucher(false);
            }, 1000);
        } catch (error) {
        } finally {
        }
    };

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
    return (
        <>
            {promotion && (
                <Animated.View style={animatedStyle} className="mb-8  border-b pb-4 border-ship-gray-100">
                    <View className="flex-row mb-2 items-start">
                        <PostHeader
                            businessProfile={promotion.business_user_profile}
                            distance={item.distance}
                            openBusinessProfile={openBusinessProfile}
                            currentLocation={currentLocation}
                            toggleFollow={toggleFollow}
                        />
                    </View>
                    <Pressable
                        className="items-end flex-row"
                        onPress={() => {
                            saveCurrentPromotionMMKV(promotion)
                            saveCurrentPromotionBusinessProfileMMKV(promotion.business_user_profile)
                            router.push('homeCustomer/cardsView/activePromotion')
                        }}>
                        <View
                            className="flex-1 justify-center items-center flex-shrink w-full border-4 border-[#f3b281] rounded-xl">
                            <View className="w-full justify-center items-center">
                                <LinearGradient
                                    colors={colColors}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    locations={[0.33, 0.6, 0.7]}
                                    style={{width: "100%", justifyContent: "center", borderRadius: 6}}>
                                    {/*<ImageBackground source={PAPER} resizeMode="cover" imageStyle={{opacity: 0.14}}>*/}
                                    <View className="w-full min-h-36">
                                        <View className="flex-row w-full min-h-32">
                                            <View className="flex-row w-full justify-between">
                                                <View className="flex-shrink py-3 px-3 justify-between">
                                                    <View className={'flex-shrink'}>
                                                        <Text
                                                            className="text-xl font-extrabold  text-ship-gray-900">
                                                            {shorterText(promotion.name, 24).toUpperCase()}
                                                        </Text>
                                                        <Text
                                                            className="text-base  text-ship-gray-900">{promotion.description}</Text>
                                                    </View>

                                                    <View
                                                        className="w-full mt-2 flex-row justify-between items-end">
                                                        <Text className="text-sm text-ship-gray-500">Promotion
                                                            ends: {promotion.date_ends}</Text>

                                                    </View>
                                                </View>
                                                <View className=" items-center justify-center p-4">

                                                    <View
                                                        className="w-28 h-28 bg-[#fce38a] rounded-lg items-center justify-center">
                                                        <View
                                                            className="items-center justify-center ">
                                                            <QRCODE width={'100'} height={'100'} stroke={'#f3b281'}/>
                                                        </View>
                                                        {!promotion.have_this_voucher &&
                                                            <View
                                                                className={'absolute bottom-1 right-1 border border-[#f3b281] rounded-md'}>
                                                                <TouchableOpacity onPress={() => getGem()}
                                                                >
                                                                    <View
                                                                        className="bg-white p-1 px-2 rounded-lg flex-row">

                                                                        <Text
                                                                            className="text-sm text-ship-gray-900">Get
                                                                            Voucher</Text>
                                                                        {issuingVoucher && (
                                                                            <View
                                                                                className="pl-2 items-center justify-center">
                                                                                <ActivityIndicator/>
                                                                            </View>
                                                                        )}
                                                                    </View></TouchableOpacity></View>}
                                                    </View>


                                                </View>
                                            </View>

                                            <View className="w-18 h-full items-center justify-center pr-5"></View>
                                        </View>
                                    </View>
                                    {/*</ImageBackground>*/}
                                </LinearGradient>
                            </View>
                        </View>
                    </Pressable>
                </Animated.View>
            )}
        </>
    );
};

export default FeedPromotion;
