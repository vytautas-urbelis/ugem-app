import {router} from "expo-router";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Haptics from "expo-haptics";
import {controlStorage} from "../../../MMKV/control";
import {useState} from "react";
import Loader from "../../smallComponents/loader";
import {UseVoucherTeams} from "../../../axios/axiosTeams/voucher";
import {UseVoucher} from "../../../axios/axiosBusiness/voucher";

import LOGO from "../../../assets/default-promotion.jpg";
import {authStorage} from "../../../MMKV/auth";
import {MEDIA_URL} from "../../../utils/CONST";

import UGEM from "../../../assets/svg/uGem.svg";
import {colors} from "../../../constants/colors";
import {GestureHandlerRootView, ScrollView} from "react-native-gesture-handler";
import {getTeamProfileMMKV} from "../../../MMKV/mmkvTeams";

const OnVoucherExists = ({voucher, scannedVoucher}) => {
    // Check is business user or team user in controll
    const isUserLogedInAsTeam = controlStorage.getBoolean("teamProfile");

    const teamProfile = getTeamProfileMMKV();
    const accestToken = authStorage.getString("accessToken");

    const [isLoading, setIsLoading] = useState(false);
    // const [success, setSuccess] = useState(null);
    // const [responseMessage, SetResponseMessage] = useState("");
    // const [errorVisible, setErrorVisible] = useState(false);
    // const [successVisible, setSuccessVisible] = useState(false);

    const useVoucher = async () => {
        setIsLoading(true);
        try {
            if (isUserLogedInAsTeam) {
                await UseVoucherTeams(scannedVoucher, teamProfile.user_id, accestToken);
                setIsLoading(false);
                router.dismiss()
                router.push("/homeTeam/scann/onVoucherScanned/success");
                // setSuccess(true);
                // setSuccessVisible(true);
                // SetResponseMessage(response.message);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                await UseVoucher(scannedVoucher, accestToken);
                setIsLoading(false);
                router.dismiss()
                router.push("/homeBusiness/scann/onVoucherScanned/success");
                // setSuccess(true);
                // setSuccessVisible(true);
                // SetResponseMessage(response.message);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        } catch (error) {
            // SetResponseMessage(error.response.data.message);
            console.log(error.response.data.message);
            router.dismiss()
            router.push("/homeBusiness/scann/onVoucherScanned/failure");
            // setSuccess(false);
            // setErrorVisible(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsLoading(false);
        }
    };

    const onClose = () => {
        router.dismiss()
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // if (isUserLogedInAsTeam) {
        //     router.push("homeTeam/scann");
        // } else {
        //     router.push("homeBusiness/scann");
        // }

        // setOnVoucherExists(false);

    };
    return (
        <>
            {/*<Modal*/}
            {/*    animationType="fade"*/}
            {/*    transparent={true}*/}
            {/*    visible={errorVisible}*/}
            {/*    onRequestClose={() => {*/}
            {/*        Alert.alert("Modal has been closed.");*/}
            {/*        setErrorVisible(!errorVisible);*/}
            {/*    }}>*/}
            {/*    <OnVoucherFailure responseMessage={responseMessage} setErrorVisible={setErrorVisible}/>*/}
            {/*</Modal>*/}
            {/*<Modal*/}
            {/*    animationType="fade"*/}
            {/*    transparent={true}*/}
            {/*    visible={successVisible}*/}
            {/*    onRequestClose={() => {*/}
            {/*        Alert.alert("Modal has been closed.");*/}
            {/*        setSuccessVisible(!successVisible);*/}
            {/*    }}>*/}
            {/*    <OnVoucherSuccess responseMessage={responseMessage} setSuccessVisible={setSuccessVisible}/>*/}
            {/*</Modal>*/}
            <GestureHandlerRootView>
                <ScrollView className="bg-ship-gray-50 flex-1 w-full">
                    <View className="bg-ship-gray-50 flex-1 justify-center items-center w-full rounded-2xl">
                        {isLoading ? (
                            <Loader/>
                        ) : (
                            <View className=" w-full items-center justify-between h-full">
                                <View className="w-full items-center mt-12">
                                    {voucher && (
                                        <>
                                            <View
                                                className="w-[90%] border mb-8 border-ship-gray-200 bg-white rounded-lg items-center mt-10 px-6 pt-6">
                                                {/* <View className=" items-start rounded-md w-full flex-row  pb-4 p-2 min-h-20">
                        {voucher.campaign.business_user_profile.logo ? (
                          <>
                            <Image
                              source={{ uri: `${MEDIA_URL}${voucher.campaign.business_user_profile.logo}` }}
                              className="w-10 h-10 rounded-full "
                              alt="qr code"
                            />
                          </>
                        ) : (
                          <View className="w-10 h-10 items-center justify-center bg-ship-gray-200 rounded-full">
                            <Text className="text-xl font-semibold">
                              {voucher.campaign.business_user_profile.business_name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}

                        <View className="w-[88%] ">
                          <Text className="pl-2 text-lg font-sem text-ship-gray-900 text-start">
                            {voucher.campaign.business_user_profile.business_name}
                          </Text>
                        </View>
                      </View> */}
                                                <View className="w-full flex-row justify-between">
                                                    <View className="w-[25%]">
                                                        {voucher.business_user_profile.logo ? (
                                                            <Image
                                                                source={{uri: `${MEDIA_URL}${voucher.business_user_profile.logo}`}}
                                                                className="w-20 h-20 rounded-md "
                                                                alt="qr code"
                                                            />
                                                        ) : (
                                                            <View
                                                                className="w-20 h-20 items-center justify-center bg-ship-gray-200 rounded-md">
                                                                <Text
                                                                    className="text-5xl font-semibold text-ship-gray-700">
                                                                    {voucher.business_user_profile.business_name.charAt(0).toUpperCase()}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>

                                                    <View className="w-[74%] ">
                                                        <Text
                                                            className="ml-2 text-2xl font-semibold text-ship-gray-900 text-start">
                                                            {voucher.business_user_profile.business_name.toUpperCase()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View className="w-full items-center mb-6 mt-8">
                                                    <Text
                                                        className="ml-2 text-3xl font-extrabold text-center text-ship-gray-900">
                                                        {voucher.campaign.name ? voucher.campaign.name.toUpperCase() : voucher.promotion.name.toUpperCase()}
                                                    </Text>
                                                </View>
                                                <View className="w-full items-center mb-6">
                                                    <Text
                                                        className="ml-2 text-base font-semibold text-ship-gray-900 text-center">
                                                        {voucher.campaign.description ? voucher.campaign.description : voucher.promotion.description}
                                                    </Text>
                                                </View>
                                                <View className="w-full">
                                                    <Text className="ml-2 text-base text-ship-gray-400 text-start">
                                                        {voucher.campaign.additional_information
                                                            ? voucher.campaign.additional_information
                                                            : voucher.promotion.additional_information}
                                                    </Text>
                                                </View>

                                                {/* <View className="h-40 w-full bg-zest-400">
                        <Text className="mt-4 text-4xl font-bold text-zest-50 text-center">
                          Free {voucher.campaign.name} for 15 stamps!
                        </Text>
                      </View> */}

                                                {/* /// Image /// voucher name /// qrcode */}
                                                {/* <Text className="mt-8 text-2xl font-bold text-zest-500 text-center">{voucher.campaign.name}</Text> */}
                                                <View className="w-full items-center rounded-lg">
                                                    <Image
                                                        source={voucher.qr_code ? {uri: `${MEDIA_URL}${voucher.qr_code}`} : LOGO}
                                                        className=" w-60 h-60 mt-4 rounded-lg"
                                                        alt="Campaign Logo"
                                                    />
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
                                                {/* <View className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[63] left-[-12] border-r border-ship-gray-200"></View>
                      <View className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[63] right-[-12] border-l border-ship-gray-200"></View> */}
                                                <View
                                                    className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[110] left-[-12] border-r border-ship-gray-200"></View>
                                                <View
                                                    className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[110] right-[-12] border-l border-ship-gray-200"></View>
                                            </View>
                                        </>
                                    )}
                                    <TouchableOpacity onPress={useVoucher}
                                                      className="w-[90%] items-center bg-zest-400 rounded-lg">
                                        <Text className="text-xl font-semibold text-ship-gray-900 p-4">Use</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity onPress={onClose}>
                                    <Text
                                        className=" pt-10 text-start text-xl font-semibold text-ship-gray-900 mb-12">Close</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </GestureHandlerRootView>
        </>
    );
};

export default OnVoucherExists;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 7.84,
        elevation: 10,
    },
});
