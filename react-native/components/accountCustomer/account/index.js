import {Dimensions, Image, RefreshControl, StyleSheet, Text, View} from "react-native";
import {getCustomerMMKV, saveCustomerMMKV} from "../../../MMKV/mmkvCustomer/user";
import {useEffect, useState} from "react";

import UGEM from "../../../assets/svg/uGem.svg";
import {colors} from "../../../constants/colors";
import {MEDIA_URL} from "../../../utils/CONST";
import {GetMeUser} from "../../../axios/axiosCustomer/customerAuth";
import {authStorage} from "../../../MMKV/auth";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../MMKV/control";
import {ScrollView} from "react-native-gesture-handler";

export default function CardsTab() {
    const [refreshing, setRefreshing] = useState(false);
    const customerUser = getCustomerMMKV() ? getCustomerMMKV() : null;

    const accessToken = authStorage.getString("accessToken");

    // MMKV booleans for modals
    const [refreshCustomerProfile, setRefreshCustomerProfile] = useMMKVBoolean("refreshCustomerProfile", controlStorage);

    // const campaignToken = controlStorage.getString("campaignToken");
    //
    // useEffect(() => {
    //     console.log(campaignToken)
    //     const getReward = async () => {
    //         try {
    //             await GetReward(accessToken, campaignToken);
    //             controlStorage.set("campaignToken", false);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //
    //     if (campaignToken) {
    //         getReward()
    //     }
    // }, [])


    useEffect(() => {
        onRefresh()

        return () => setRefreshing(false)
    }, [refreshCustomerProfile])

    // Refresh handler for pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const userData = await GetMeUser(accessToken);
            saveCustomerMMKV(userData);
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false)
        }
    };


    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={true}/>}
                        className="h-full bg-white w-full">
                <View
                    style={styles.cardShadow}
                    className="h-full justify-center items-center flex mt-4 w-full">
                    <View className=" w-full items-center justify-start flex p-4">
                        {!customerUser.customer_user_profile.is_verified &&
                            <View className="bg-orange-50 rounded-lg border border-orange-300 mb-4">
                                <View className={'p-3'}>
                                    <Text className={'text-base text-ship-gray-900 '}>
                                        Verify your <Text
                                        className={'font-bold'}>email</Text>. A verification link has been sent to your
                                        email address.
                                    </Text>
                                </View>
                            </View>}

                        <View
                            className="items-center  max-w-[360] justify-center bg-white rounded-lg px-6  border border-ship-gray-200">
                            <View className="w-full  items-start flex-row mt-6">
                                <View className="w-[60%]  justify-between">
                                    <View className="mb-4">
                                        <View className=" w-full">
                                            <Text className="text-base text-ship-gray-500">Card Holder</Text>
                                        </View>
                                        <View className=" w-full">
                                            <Text
                                                className="text-2xl font-semibold text-ship-gray-900">{customerUser.customer_user_profile.nickname}</Text>
                                        </View>
                                    </View>
                                    <View className="mb-4">
                                        <View className=" w-full">
                                            <Text className="text-base text-ship-gray-500">Card type</Text>
                                        </View>
                                        <View className=" w-full">
                                            <Text className="text-xl font-semibold text-ship-gray-900">
                                                #{customerUser.customer_user_profile.customer_card.card_type.type.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="items-end w-[40%]">
                                    {customerUser.customer_user_profile.avatar ? (
                                        <Image
                                            source={{uri: `${MEDIA_URL}${customerUser.customer_user_profile.avatar}`}}
                                            className="w-28 h-28 mt-1 rounded-md "
                                            alt="qr code"
                                        />
                                    ) : (
                                        <View
                                            className="w-28 h-28 items-center justify-center bg-ship-gray-200 rounded-md">
                                            <Text className="text-5xl font-semibold text-ship-gray-700">
                                                {customerUser.customer_user_profile.nickname.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View className="w-full items-center mt-4">
                                <Text className="text-lg w-72 text-center text-ship-gray-500">
                                    {/*This card can be used in every small business who have joinded uGem comunity*/}
                                </Text>

                            </View>

                            <View className="w-full items-center mt-4">
                                <Image
                                    source={{uri: `${MEDIA_URL}${customerUser.customer_user_profile.customer_card.qr_code}`}}
                                    className=" w-60 h-60 mb-7 mt-1 rounded-md opacity-100"
                                    alt="Campaign Logo"
                                />
                            </View>
                            <View className="w-full flex-row justify-between mt-5 mb-2">
                                <View className="w-[70%]">
                                    <Text
                                        className="ml-2 text-base text-ship-gray-400 text-start">Created {customerUser.date_joined.split("T")[0]}</Text>
                                </View>
                                <View className="w-[30%] items-end mb-4">
                                    <UGEM width={60} height={15} fill={colors.zest["400"]}/>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.2,
        shadowRadius: 7.84,
        elevation: 10,
    },
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 1.84,
        elevation: 2,
    },

    photoHeight: {
        height: Dimensions.get("window").width,
    },
});