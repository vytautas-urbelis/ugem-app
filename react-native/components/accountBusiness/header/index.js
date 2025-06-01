import {Image, Text, TouchableOpacity, View} from "react-native";

import * as Haptics from "expo-haptics";

import UGEM from "../../../assets/svg/uGem.svg";
import {colors} from "../../../constants/colors";
import {MEDIA_URL} from "../../../utils/CONST";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../MMKV/control";
import {getBusinessMMKV} from "../../../MMKV/mmkvBusiness/user";

export default function BusinessHeader(setVerifyBusinessUser) {
    const [isBusinessAccountSettings, setIsBusinessAccountSettings] = useMMKVBoolean('isBusinessAccountSettings', controlStorage)


    const businessUser = getBusinessMMKV();
    const isBusinessUserVerified = businessUser.business_user_profile.is_verified;

    // Open and close account settings modal
    const openCloseSettings = () => {
        setIsBusinessAccountSettings(!isBusinessAccountSettings);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <>
            <View className="h-8 bg-ship-gray-50 w-full"></View>
            <View
                className="flex-row h-20 w-full justify-between pl-5 pr-5 bg-ship-gray-50 border-b border-ship-gray-200">
                {/*{!isBusinessUserVerified ? (*/}
                {/*    <View className="w-full">*/}
                {/*        <TouchableOpacity onPress={() => setVerifyBusinessUser(true)}*/}
                {/*                          className="absolute top-5 right-2 p-1 rounded-md bg-red-400">*/}
                {/*            <Text className="text-white">unverified</Text>*/}
                {/*        </TouchableOpacity>*/}
                {/*        <View className="w-[100%] h-16 justify-center items-center">*/}
                {/*            <UGEM width={80} height={24} fill={colors.zest["400"]}/>*/}
                {/*        </View>*/}
                {/*    </View>*/}
                {/*) : (*/}
                <View className="w-[100%]  justify-center items-center">
                    <UGEM width={80} height={24} fill={colors.zest["400"]}/>
                </View>
                {/*)}*/}

                <View className="absolute left-5 ">
                    <TouchableOpacity onPress={openCloseSettings} className="items-end justify-end h-18 ">
                        {businessUser.business_user_profile.logo ? (
                            <Image
                                source={{uri: `${MEDIA_URL}${businessUser.business_user_profile.logo}`}}
                                className="w-12 h-12 mt-4 rounded-full "
                                alt="qr code"
                            />
                        ) : (
                            <View className="w-12 h-12 items-center justify-center bg-ship-gray-200 rounded-full">
                                <Text
                                    className="text-2xl font-semibold">{businessUser.business_user_profile.business_name.charAt(0).toUpperCase()}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}
