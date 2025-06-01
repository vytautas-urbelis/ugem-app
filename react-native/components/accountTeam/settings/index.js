import {View, Text, StyleSheet, Linking} from "react-native";
import {useState} from "react";
import {BottomModal, SlideAnimation} from "react-native-modals";
import * as Haptics from "expo-haptics";

// Import custom components and modals
import SaveLoader from "../../smallComponents/smLoader";
import ConfLogOut from "./confLogOut";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import SwitchProfile from "../../../app/switcher/index";
import {BaseButton, ScrollView} from "react-native-gesture-handler";
import {colors} from "../../../constants/colors";
import {getTeamProfileMMKV} from "../../../MMKV/mmkvTeams";
import {MEDIA_URL} from "../../../utils/CONST";
import {router} from "expo-router";

export default function AccountSettings({switchSettingsOff}) {
    // Retrieve business user data from storage
    const teamBusinessUser = getTeamProfileMMKV();

    // State variables to control visibility of various modals and loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isLogOut, setIsLogOut] = useState(false);
    const [isSwitchProfile, setIsSwitchProfile] = useState(false);


    return (
        <>

            <ScrollView className="h-screen w-full pt-10">

                    <>
                        {/* Switch profile */}
                        <BaseButton
                            onPress={() => {
                                setIsSwitchProfile(true);
                            }}
                            >
                            <View className="items-center flex-row w-full">
                            <View className="pl-5 w-10/12 mt-3 items-start justify-center h-14">
                                <Text className=" text-shamrock-500 text-base">Teams Profile</Text>
                                <Text
                                    className=" text-xl text-left font-semibold text-ship-gray-900 ">{teamBusinessUser.business_name}</Text>
                            </View>
                            <View className="items-end pr-6 mt-4 w-2/12">
                                <MaterialCommunityIcons name="dots-horizontal" size={30}
                                                        color={colors.zest["400"]}/>
                            </View>
                            </View>
                        </BaseButton>

                        <View className="flex-row  mr-5 pb-2 mt-2 ml-2">
                            <View className=" w-14 items-center justify-center flex-row">
                                <MaterialCommunityIcons name="account-outline" size={18}
                                                        color={colors["ship-gray"][400]}/>
                                <Text
                                    className="text-xs font-semibold text-ship-gray-600 text-center mt-1 ml-1">
                                    {teamBusinessUser.followers_number}
                                </Text>
                            </View>
                            <View className=" w-14 items-center justify-center flex-row">
                                <MaterialCommunityIcons name="heart" size={18}
                                                        color={colors["ship-gray"][400]}/>
                                <Text
                                    className="text-xs font-semibold text-ship-gray-600 text-center mt-1 ml-1">
                                    {teamBusinessUser.hearts_number}
                                </Text>
                            </View>
                            <View className=" w-14 items-center justify-center flex-row">
                                {/* <Ionicons name="ticket-outline" size={24} color="black" /> */}
                                <MaterialIcons name="card-giftcard" size={18} color={colors["ship-gray"][400]}/>
                                <Text
                                    className="text-xs font-semibold text-ship-gray-600 text-center mt-1 ml-1">
                                    {teamBusinessUser.issued_vouchers}
                                </Text>
                            </View>
                            {/* <View className="w-16 h-16"></View> */}

                            {/* <View className="h-6 w-14 items-center justify-center flex-row">
                      <View style={{ backgroundColor: businessRating }} className="h-8 w-8 rounded-full ml-1"></View>
                    </View> */}
                        </View>
                        <View className="border-b border-b-ship-gray-100 ml-4 mr-4 mb-2"></View>
                    </>
                    {/* Business name */}

                    {/* Business Account Section */}

                    <View className="m-4 rounded-lg flex flex-col p-2 bg-ship-gray-50">
                        <BaseButton onPress={() => {
                            router.push("/homeTeam/settings/about");
                            switchSettingsOff()
                        }}>
                            <View className="border-b border-b-gray-200">
                                <Text className="m-3 text-lg font-semibold text-ship-gray-900">About
                                    SwiftyBee</Text>
                            </View>
                        </BaseButton>
                        <BaseButton onPress={() => Linking.openURL(`${MEDIA_URL}terms-of-use`)}>
                            <View className="border-b border-b-gray-200">
                                <Text className="m-3 text-lg font-semibold text-ship-gray-900">Terms Of
                                    Use</Text>
                            </View>
                        </BaseButton>
                        <BaseButton onPress={() => Linking.openURL(`${MEDIA_URL}privacy-policy`)}>
                            <View>
                                <Text className="m-3 text-lg font-semibold text-ship-gray-900">Privacy
                                    Policy</Text>
                            </View>
                        </BaseButton>
                    </View>

                    {/* Log Out Option */}
                <View className="m-4 rounded-lg flex flex-col p-2 bg-ship-gray-50">
                    <BaseButton
                        onPress={() => {
                            setIsLogOut(true);
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        }}
                        className="m-3 rounded-lg flex flex-col p-2 bg-ship-gray-50">
                        <View className="w-full items-center">
                            <View>
                                {isLoading ? <SaveLoader/> :
                                    <Text className="m-2 text-lg font-semibold text-ship-gray-900">Log
                                        out</Text>}
                            </View>
                        </View>
                    </BaseButton>
                </View>

                    {/* Spacing at the bottom of the screen */}
                    <View className="h-20"></View>

            </ScrollView>


            {/* Log Out Confirmation Modal */}
            <BottomModal
                style={{zIndex: 2}}
                visible={isLogOut}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <ConfLogOut setIsLogOut={setIsLogOut}/>
            </BottomModal>

            {/* SwitchAccount modal */}
            <BottomModal
                onTouchOutside={() => {
                    setIsSwitchProfile(false);
                }}
                style={{zIndex: 2}}
                visible={isSwitchProfile}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <SwitchProfile setIsSwitchProfile={setIsSwitchProfile} closeSettings={switchSettingsOff}/>
            </BottomModal>
        </>
    );
}

// Styles
const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 1.84,
        elevation: 2,
    },
});
