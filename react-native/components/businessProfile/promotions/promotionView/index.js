import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import UGEM from "../../../../assets/svg/uGem.svg";
import {colors} from "../../../../constants/colors";

import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useEffect, useState} from "react";
import {getCustomerMMKV} from "../../../../MMKV/mmkvCustomer/user";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../../MMKV/control";
import {Feather} from "@expo/vector-icons";

import PAPER from "../../../../assets/paper.png";
import QRCODE from "../../../../assets/pngs/qrcode.png";
import {router} from "expo-router";

const PromotionView = ({promotion, businessProfile}) => {
    const [imageLoad, setImageLoad] = useState(true);
    const [refreshVouchers, setRefreshVouchers] = useMMKVBoolean("refreshVouchers", controlStorage);

    customerUser = getCustomerMMKV() ? getCustomerMMKV() : null;
    // accessToken = authStorage.getString("accessToken");

    // const scale = useSharedValue(1);
    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            // transform: [{scale: scale.value}],
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        // scale.value = withTiming(1, {duration: 1000, easing: Easing.out(Easing.exp)});
        opacity.value = withTiming(1, {duration: 1000, easing: Easing.out(Easing.exp)});
    }, []);

    return (
        <>
            <View className="w-full h-28 bg-white justify-center items-center border-b border-b-ship-gray-100">
                <TouchableOpacity
                    onPress={() => {
                        router.back()
                    }}
                    className="w-12 h-12 items-start justify-center absolute top-12 left-4">
                    <Feather name="chevron-left" size={24} color={colors["ship-gray"]["800"]}/>
                </TouchableOpacity>
                <View className="mt-10">
                    <Text className="text-lg font-semibold">Promotion</Text>
                </View>
            </View>
            <ScrollView className="w-screen h-screen bg-ship-gray-50 p-5">
                <Animated.View style={animatedStyle}>
                    <TouchableOpacity activeOpacity={0.99}>
                        <View className=" w-full items-center justify-between h-screen">
                            <View className="w-full  max-w-[360] items-center">
                                {promotion && (
                                    <>
                                        <View
                                            className="w-full border mb-8 border-ship-gray-200 bg-white rounded-lg items-center">
                                            {/*<LinearGradient*/}
                                            {/*  colors={colColors}*/}
                                            {/*  start={{ x: 0, y: 0 }}*/}
                                            {/*  end={{ x: 1, y: 1 }}*/}
                                            {/*  locations={[0.33, 0.6, 0.7]}*/}
                                            {/*  style={{ width: "100%", justifyContent: "center", borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>*/}
                                            <ImageBackground
                                                className=" w-full rounded-lg"
                                                source={PAPER}
                                                resizeMode="cover"
                                                onLoadEnd={() => setImageLoad(true)}
                                                imageStyle={{opacity: 0.2}}>
                                                <View className="w-full flex-row p-4 rounded-lg">
                                                    <View className="w-18">
                                                        {/*<Pressable onPress={() => router.push({*/}
                                                        {/*    pathname: `/homeCustomer/businessProfile/${promotion.business_user_profile.user.id}`,*/}
                                                        {/*    params: {businessID: promotion.business_user_profile.user.id}*/}
                                                        {/*})}>*/}
                                                        {businessProfile.logo ? (
                                                            <Image source={{uri: `${businessProfile.logo}`}}
                                                                   className="w-16 h-16 rounded-md " alt="qr code"/>
                                                        ) : (
                                                            <View
                                                                className="w-16 h-16 items-center justify-center bg-ship-gray-100 rounded-md">
                                                                <Text
                                                                    className="text-4xl font-semibold text-ship-gray-700">
                                                                    {promotion.business_user_profile.business_name.charAt(0).toUpperCase()}
                                                                </Text>
                                                            </View>
                                                        )}
                                                        {/*</Pressable>*/}
                                                    </View>

                                                    <View className="flex-shrink">
                                                        <Text
                                                            className="ml-2 text-xl text-ship-gray-900 font-semibold text-start">
                                                            {promotion.business_user_profile.business_name}
                                                        </Text>
                                                        <Text
                                                            className="ml-2 text-base text-ship-gray-700 text-start">{promotion.date_created.split("T")[0]}</Text>
                                                    </View>
                                                </View>
                                            </ImageBackground>
                                            {/*</LinearGradient>*/}
                                            <View
                                                className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[75] left-[-12] border-r border-ship-gray-200"></View>
                                            <View
                                                className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[75] right-[-12] border-l border-ship-gray-200"></View>
                                            <View className="w-full p-4 items-center">
                                                <View className="w-full items-center mb-2 mt-8">
                                                    <Text
                                                        className=" text-2xl font-bold text-ship-gray-700 text-center">{promotion.name.toUpperCase()}</Text>
                                                </View>
                                                <View className="w-full items-center mb-2">
                                                    <Text
                                                        className=" text-lg  text-ship-gray-600 text-center">{promotion.description}</Text>
                                                </View>

                                                <View className="w-full items-center rounded-lg">
                                                    <Image
                                                        source={QRCODE}
                                                        className=" w-60 h-60 mt-2 mb-4 rounded-lg"
                                                        alt="Campaign Logo"
                                                    />
                                                    <View className="w-full items-center">
                                                        <Text
                                                            className=" text-base  text-ship-gray-300 text-center">{promotion.additional_information}</Text>
                                                    </View>
                                                    <View className="w-full flex-row justify-between mt-8">
                                                        <View className="w-[70%]">
                                                            <Text
                                                                className="ml-2 text-base text-ship-gray-400 text-start">Valid
                                                                until {promotion.date_ends}</Text>
                                                        </View>
                                                        <View className="w-[30%] items-end">
                                                            <UGEM width={60} height={15} fill={colors.zest["400"]}/>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {/* <View className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[63] left-[-12] border-r border-ship-gray-200"></View>
                      <View className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[63] right-[-12] border-l border-ship-gray-200"></View> */}
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
            {/* <View className="absolute bottom-8 right-8">
        <TouchableOpacity
          onPress={() => {
            setIsPromotionView(false);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          }}
          style={{ shadowColor: "black", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3.84, elevation: 2 }}
          className="w-12 h-12 rounded-full bg-white items-center justify-center">
          <AntDesign name="arrowdown" size={24} color="black" />
        </TouchableOpacity>
      </View> */}
        </>
    );
};

export default PromotionView;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 7.84,
        elevation: 10,
    },
});
