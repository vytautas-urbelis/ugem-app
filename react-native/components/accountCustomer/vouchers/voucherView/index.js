import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MEDIA_URL} from "../../../../utils/CONST";

import UGEM from "../../../../assets/svg/uGem.svg";
import {colors} from "../../../../constants/colors";
import {useEffect, useState} from "react";
import {getCustomerMMKV} from "../../../../MMKV/mmkvCustomer/user";
import {CheckIfVoucherIsUsed} from "../../../../axios/axiosCustomer/voucher";

import LOGO from "../../../../assets/vectors/default.png";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../../MMKV/control";
import {authStorage} from "../../../../MMKV/auth";
import {Feather} from "@expo/vector-icons";

import PAPER from "../../../../assets/paper4.png";
import {router} from "expo-router";

const VoucherView = ({
                         voucher,
                     }) => {
    const [imageLoaded, setImageLoaded] = useState(true);
    const [refreshVouchers, setRefreshVouchers] = useMMKVBoolean("refreshVouchers", controlStorage);

    customerUser = getCustomerMMKV() ? getCustomerMMKV() : null;
    accessToken = authStorage.getString("accessToken");

    // const scale = useSharedValue(0.8);
    // const opacity = useSharedValue(0);

    const businesId = voucher.business_id;

    useEffect(() => {
        const checkIfUsed = async () => {
            const data = await CheckIfVoucherIsUsed(voucher.id, accessToken);
            if (data.is_used === "true") {
                clearInterval(interval);
                router.back()
            }
        };

        const interval = setInterval(checkIfUsed, 2000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // const animatedStyle = useAnimatedStyle(() => {
    //     return {
    //         transform: [{scale: scale.value}],
    //         opacity: opacity.value,
    //     };
    // });
    //
    // useEffect(() => {
    //     if (imageLoaded) {
    //         scale.value = withTiming(1, {duration: 1000, easing: Easing.out(Easing.exp)});
    //         opacity.value = withTiming(1, {duration: 1000, easing: Easing.out(Easing.exp)});
    //     }
    //     return () => {
    //         cancelAnimation(scale);
    //         cancelAnimation(opacity)
    //     };
    // }, [imageLoaded]);

    return (
        <>
            <View className="w-full h-28 bg-white justify-center items-center border-b border-b-ship-gray-100">
                <TouchableOpacity
                    onPress={() => {
                        router.back()
                    }}
                    className="16 h-16 items-start justify-center absolute top-12 left-4">
                    <Feather name="chevron-left" size={24} color={colors["ship-gray"]["800"]}/>
                </TouchableOpacity>
                <View className="mt-10">
                    <Text className="text-3xl font-bold text-normaltext">Voucher</Text>
                </View>
            </View>
            <ScrollView className="w-screen h-screen bg-ship-gray-50 p-5">
                <View>
                    <TouchableOpacity activeOpacity={0.99}>
                        <View className=" w-full items-center justify-between h-screen">
                            <View className="w-full items-center max-w-[360]">
                                {voucher && (
                                    <>
                                        <View
                                            className=" border mb-8 border-ship-gray-200 bg-white rounded-lg items-center">
                                            {/* <View className="w-full p-4"> */}
                                            {/*<LinearGradient*/}
                                            {/*    // colors={["#fa8da4", "#c58dfa", "#8d9efa"]}*/}
                                            {/*    colors={voucherColors}*/}
                                            {/*    start={{x: 0, y: 0}}*/}
                                            {/*    end={{x: 1, y: 1}}*/}
                                            {/*    locations={[0.2, 0.6]}*/}
                                            {/*    style={{width: "100%", borderRadius: 7}}>*/}
                                            <ImageBackground
                                                className="w-full flex-row"
                                                source={PAPER}
                                                resizeMode="cover"
                                                onLoadEnd={() => setImageLoaded(true)}
                                                imageStyle={{opacity: 0.3}}>
                                                <TouchableOpacity
                                                    onPress={() => {

                                                        router.push({
                                                            pathname: `/homeCustomer/businessProfile/${businesId}`,
                                                            params: {businessID: businesId}
                                                        })
                                                    }}
                                                    className="w-full flex-row  p-4">
                                                    <View className="">
                                                        {voucher.business_user_profile.logo ? (
                                                            <Image
                                                                source={{uri: `${MEDIA_URL}${voucher.business_user_profile.logo}`}}
                                                                className="w-16 h-16 rounded-md "
                                                                alt="qr code"
                                                            />
                                                        ) : (
                                                            <View
                                                                className="w-12 h-12 items-center justify-center bg-ship-gray-200 rounded-md">
                                                                <Text
                                                                    className="text-2xl font-semibold text-ship-gray-700">
                                                                    {voucher.business_user_profile.business_name.charAt(0).toUpperCase()}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>

                                                    <View className="flex-grow">
                                                        <Text
                                                            className="ml-2 text-xl font-semibold text-ship-gray-900 text-start">
                                                            {voucher.business_user_profile.business_name}
                                                        </Text>
                                                        <Text
                                                            className="ml-2 text-base text-ship-gray-700 text-start">{voucher.date_created.split("T")[0]}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                {/* </View> */}
                                            </ImageBackground>
                                            {/*</LinearGradient>*/}
                                            <View className="w-full p-4 items-center">
                                                <View className="w-full items-center mb-2 mt-8">
                                                    <Text
                                                        className="ml-2 text-3xl font-extrabold text-center text-ship-gray-900">
                                                        {voucher.campaign.name ? voucher.campaign.name.toUpperCase() : voucher.promotion.name.toUpperCase()}
                                                    </Text>
                                                </View>
                                                <View className="w-full items-center mb-2">
                                                    <Text className="ml-2 text-lg  text-ship-gray-900 text-center">
                                                        {voucher.campaign.description ? voucher.campaign.description : voucher.promotion.description}
                                                    </Text>
                                                </View>


                                                <View className="w-full items-center rounded-lg">
                                                    <Image
                                                        source={voucher.qr_code ? {uri: `${MEDIA_URL}${voucher.qr_code}`} : LOGO}
                                                        className=" w-60 h-60 mt-4 rounded-lg mb-4"
                                                        alt="Campaign Logo"
                                                    />
                                                    <View className="w-full items-center mb-4">
                                                        <Text className="ml-2 text-base text-ship-gray-400 text-start">
                                                            {voucher.campaign.additional_information
                                                                ? voucher.campaign.additional_information
                                                                : voucher.promotion.additional_information}
                                                        </Text>
                                                    </View>
                                                    <View className="w-full flex-row justify-between mt-5">
                                                        <View className="w-[70%]">
                                                            <Text
                                                                className="ml-2 text-base text-ship-gray-400 text-start">Valid
                                                                until {voucher.expiration_date}</Text>
                                                        </View>
                                                        <View className="w-[30%] items-end mb-4">
                                                            <UGEM width={60} height={15} fill={colors.zest["400"]}/>
                                                        </View>
                                                    </View>
                                                </View>

                                            </View>
                                            <View
                                                className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[75] left-[-12] border-r border-ship-gray-200"></View>
                                            <View
                                                className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[75] right-[-12] border-l border-ship-gray-200"></View>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* </View> */}
                </View>
            </ScrollView>
        </>
    );
};

export default VoucherView;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 7.84,
        elevation: 10,
    },
});
