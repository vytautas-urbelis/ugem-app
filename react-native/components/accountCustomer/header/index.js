import {Image, Text, View} from "react-native";

import * as Haptics from "expo-haptics";

import UGEM from "../../../assets/svg/uGem.svg";
import {colors} from "../../../constants/colors";
import {MEDIA_URL} from "../../../utils/CONST";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../MMKV/control";
import {router} from "expo-router";
import {Pressable} from "react-native-gesture-handler"

export default function Header({customerUser}) {
    const [isAccountSettings, setIsAccountSettings] = useMMKVBoolean('isAccountSettings', controlStorage)

    // Open and close account settings modal
    const openCloseSettings = () => {
        setIsAccountSettings(!isAccountSettings);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <>
            <View className="h-10 bg-ship-gray-50 w-full"></View>
            <View
                className="flex-row w-full justify-between pl-5 pr-5 pb-1 bg-ship-gray-50 border-b border-ship-gray-100">
                <View className="w-[100%] h-16 justify-center items-center">
                    <Pressable className={'w-[100%] h-16 justify-center items-center'}
                               onPress={() => router.replace('homeCustomer/home/cards')}>


                        <UGEM width={80} height={24} fill={colors.zest["400"]}/>

                    </Pressable>
                </View>

                <View className="absolute left-4 ">
                    <View className="items-end justify-end ">
                        <Pressable onPress={() => openCloseSettings()}>
                            <View className="w-16 h-16  items-center justify-center">
                                {customerUser.customer_user_profile.avatar ? (
                                    <Image
                                        source={{uri: `${MEDIA_URL}${customerUser.customer_user_profile.avatar}`}}
                                        className="w-12 h-12 mt-1 rounded-full "
                                        alt="qr code"
                                    />
                                ) : (
                                    <View
                                        className="w-12 h-12 items-center justify-center bg-ship-gray-200 rounded-full">
                                        <Text
                                            className="text-2xl font-semibold">{customerUser.customer_user_profile.nickname.charAt(0).toUpperCase()}</Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>
                    </View>
                </View>
            </View>

        </>
    );
}
