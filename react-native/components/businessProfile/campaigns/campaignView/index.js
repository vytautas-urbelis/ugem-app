import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import * as Progress from "react-native-progress";

import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useEffect, useState} from "react";
import {getCustomerMMKV} from "../../../../MMKV/mmkvCustomer/user";

import UGEM from "../../../../assets/svg/uGem.svg";

import {returnStamp} from "../../../../utils/stamps";
import {colors} from "../../../../constants/colors";
import {Feather} from "@expo/vector-icons";

import PAPER from "../../../../assets/paper.png";
import {router} from "expo-router";

const CampaignView = ({campaign}) => {
    const customerUser = getCustomerMMKV() ? getCustomerMMKV() : null;
    // accessToken = authStorage.getString("accessToken");

    const [imageLoad, setImageLoad] = useState(true);

    // const percent = parseFloat(collector.value_counted / collector.value_goal);
    const collectorType = campaign.collector_type;

    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        if (imageLoad) {
            scale.value = withTiming(1, {duration: 1000, easing: Easing.out(Easing.exp)});
            opacity.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
        }
    }, [imageLoad]);

    const renderRoundObjects = () => {
        let roundObjects = [];
        for (let i = 0; i < campaign.value_goal; i++) {
            roundObjects.push(
                <View
                    className=" h-[55] w-[55] rounded-full m-4 ml-4 mr-4 items-center justify-center"
                    key={i}
                    style={{backgroundColor: colors["ship-gray"]["100"]}}>
                    {returnStamp(colors["moody-blue"]["200"], campaign.stamp_design, 90)}
                </View>,
            );
        }
        return roundObjects;
    };

    return (
        <>
            <View className="w-full h-28 bg-white justify-center items-center border-b border-b-ship-gray-100">
                <TouchableOpacity
                    onPress={() => {
                        router.back()
                    }}
                    className="w-16 h-16 items-start justify-center absolute top-12 left-4">
                    <Feather name="chevron-left" size={24} color={colors["ship-gray"]["800"]}/>
                </TouchableOpacity>
                <View className="mt-10">
                    <Text className="text-3xl font-bold text-normaltext">Campaign</Text>
                </View>
            </View>
            <ScrollView className="w-screen h-screen p-5 bg-ship-gray-50 ">
                <TouchableOpacity activeOpacity={0.99}>
                    <Animated.View style={animatedStyle} className="">
                        <View className="bg-ship-gray-50  justify-between h-screen">
                            <View className="w-full  items-center ">
                                <View className="w-full max-w-[360]  mt-1 ">
                                    <View
                                        className={`  items-center bg-white border border-ship-gray-200 rounded-lg w-full justify-between`}>
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
                                                    {/*    pathname: `/homeCustomer/businessProfile/${campaign.business_user_profile.user.id}`,*/}
                                                    {/*    params: {businessID: campaign.business_user_profile.user.id}*/}
                                                    {/*})}>*/}
                                                    {campaign.business_user_profile.logo ? (
                                                        <Image
                                                            source={{uri: `${campaign.business_user_profile.logo}`}}
                                                            className="w-16 h-16 rounded-md "
                                                            alt="qr code"
                                                        />
                                                    ) : (
                                                        <View
                                                            className="w-16 h-16 items-center justify-center bg-ship-gray-100 rounded-md">
                                                            <Text
                                                                className="text-4xl font-semibold text-ship-gray-700">
                                                                {campaign.business_user_profile.business_name.charAt(0).toUpperCase()}
                                                            </Text>
                                                        </View>
                                                    )}
                                                    {/*</Pressable>*/}
                                                </View>

                                                <View className="flex-shrink">
                                                    <Text
                                                        className="ml-2 text-xl text-ship-gray-900 font-semibold text-start">
                                                        {campaign.business_user_profile.business_name}
                                                    </Text>
                                                    <Text
                                                        className="ml-2 text-base text-ship-gray-700 text-start">{campaign.date_created.split("T")[0]}</Text>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                        {/*</LinearGradient>*/}
                                        <View
                                            className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[75] left-[-12] border-r border-ship-gray-200"></View>
                                        <View
                                            className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[75] right-[-12] border-l border-ship-gray-200"></View>
                                        <View className="w-full items-center p-4">
                                            <View className="w-full items-center mt-2 mb-3">
                                                <Text
                                                    className=" text-2xl font-bold text-ship-gray-700 text-center">{campaign.name.toUpperCase()}</Text>
                                            </View>
                                            <View className="w-full items-center mt-2 mb-3">
                                                <Text
                                                    className=" text-lg  text-ship-gray-600 text-center">{campaign.description}</Text>
                                            </View>
                                            {collectorType === 1 ? (
                                                <>
                                                    <View
                                                        className=" flex-row w-[280] flex-wrap items-center justify-center">{renderRoundObjects()}</View>
                                                </>
                                            ) : collectorType === 2 ? (
                                                <>
                                                    <View className="w-full items-center flex mt-2">
                                                        <View className="w-full items-center  mb-2 mt-6 px-3">
                                                            <Progress.Circle
                                                                size={190}
                                                                indeterminate={false}
                                                                progress={0}
                                                                borderWidth={0}
                                                                unfilledColor={colors["moody-blue"]["200"]}
                                                                color={colors["moody-blue"]["500"]}
                                                                thickness={28}
                                                                textStyle={{
                                                                    color: colors["moody-blue"]["500"],
                                                                    fontSize: 32,
                                                                    fontWeight: 700
                                                                }}
                                                            />
                                                            <Text
                                                                className=" text-3xl font-bold top-[60] text-blue-500 text-start absolute">{campaign.value_goal}</Text>
                                                            <Text
                                                                className=" text-2xl font-bold top-[86] text-blue-500 text-start absolute">Gems</Text>
                                                        </View>
                                                    </View>
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                            {/* <View className="w-full items-center mt-2 mb-3">
                        <Text className=" text-base  text-ship-gray-300 text-start">{campaign.additional_information}</Text>
                      </View> */}
                                            <View className="w-full items-center mt-4 mb-3">
                                                <Text className=" text-base  text-ship-gray-600 text-center">
                                                    Visit <Text
                                                    className="font-semibold text-ship-gray-900">{campaign.business_user_profile.business_name}</Text> to
                                                    participate in this campaign.
                                                </Text>
                                            </View>
                                            <View className="flex-row w-full justify-between items-end">
                                                <View className="">
                                                    <Text className="ml-2 text-base text-ship-gray-400 text-start">Campaign
                                                        ends: {campaign.ending_date}</Text>
                                                </View>
                                                <View className=" items-end mt-3 mb-1">
                                                    <UGEM width={60} height={14} fill={colors.zest["400"]}/>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* <TouchableOpacity
                className="w-full mb-28"
                onPress={() => {
                  setIsCampaignView(false);
                }}>
                <View className="mt-5 p-4 bg-white w-full border border-ship-gray-200 rounded-lg items-center">
                  <TextFontRegular size={16} font={"normal"}>
                    Close
                  </TextFontRegular>
                </View>
              </TouchableOpacity> */}
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </ScrollView>
            {/* <View className="absolute bottom-8 right-8">
        <TouchableOpacity
          onPress={() => {
            setIsCampaignView(false);
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

export default CampaignView;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 7.84,
        elevation: 10,
    },
});
