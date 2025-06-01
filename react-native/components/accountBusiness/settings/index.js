import {Image, Linking, Platform, Pressable, StyleSheet, Text, View} from "react-native";
import {getBusinessMMKV} from "../../../MMKV/mmkvBusiness/user";
import {useState} from "react";
import {BottomModal, SlideAnimation} from "react-native-modals";
import * as Haptics from "expo-haptics";

// Import custom components and modals
import SaveLoader from "../../smallComponents/smLoader";
import ConfLogOut from "./confLogOut";
import ConfSendQr from "./confSendQr";
import ConfirmDeletion from "./deleteAccount/confirm";
import DeleteAccount from "./deleteAccount/delete";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";

import SwitchProfile from "../../../app/switcher/index";
import {BaseButton, ScrollView} from "react-native-gesture-handler";
import {colors} from "../../../constants/colors";
import {MEDIA_URL} from "../../../utils/CONST";
import {router} from "expo-router";
import {useRevenueCatContext} from "../../../utils/RCWrapper";

export default function AccountSettings({switchSettingsOff}) {
    // Retrieve business user data from storage
    const businessUser = getBusinessMMKV();
    const isBusinessUserVerified = getBusinessMMKV() ? businessUser.business_user_profile.is_verified : false;
    const isVIP = businessUser.business_user_profile.is_vip

    // State variables to control visibility of various modals and loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isLogOut, setIsLogOut] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [isDeleteAccount, setIsDeleteAccount] = useState(false);
    const [isSendQr, setIsSendQr] = useState(false);
    const [isSwitchProfile, setIsSwitchProfile] = useState(false);


    const {
        checkUserSubscriptionStatus,
        currentSubscription
    } = useRevenueCatContext()

    // console.log('subscription: ', currentSubscription)


    // Function to handle account deletion confirmation
    const OnDeletionConfirmed = () => {
        setIsConfirmDelete(false);
        setIsDeleteAccount(true);
    };

    const subscriptionName = (subscriptionId) => {
        if (subscriptionId === '001') {
            return 'Monthly'
        } else if (subscriptionId === '002') {
            return 'Annual'
        }
    }

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}
                        className="h-fit w-full pt-10 ">
                {/*<Pressable className="w-full">*/}
                <View className="w-12/12">
                    {isBusinessUserVerified ? (
                        <>
                            {/* Switch profile */}
                            <BaseButton
                                onPress={() => {
                                    setIsSwitchProfile(true);
                                }}
                                className="items-center flex-row w-full">
                                <View className="items-center flex-row w-full">
                                    <View className="pl-5 w-10/12 mt-3 items-start justify-center h-14">
                                        <Text className=" text-zest-400 font-semibold text-base">Switch profile</Text>
                                        <Text className=" text-xl text-left font-semibold text-ship-gray-900 ">
                                            {businessUser.business_user_profile.business_name}
                                        </Text>
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
                                        {businessUser.business_user_profile.followers_number}
                                    </Text>
                                </View>
                                <View className=" w-14 items-center justify-center flex-row">
                                    <MaterialCommunityIcons name="heart" size={18}
                                                            color={colors["ship-gray"][400]}/>
                                    <Text
                                        className="text-xs font-semibold text-ship-gray-600 text-center mt-1 ml-1">
                                        {businessUser.business_user_profile.hearts_number}
                                    </Text>
                                </View>
                                <View className=" w-14 items-center justify-center flex-row">
                                    {/* <Ionicons name="ticket-outline" size={24} color="black" /> */}
                                    <MaterialIcons name="card-giftcard" size={18}
                                                   color={colors["ship-gray"][400]}/>
                                    <Text
                                        className="text-xs font-semibold text-ship-gray-600 text-center mt-1 ml-1">
                                        {businessUser.business_user_profile.issued_vouchers}
                                    </Text>
                                </View>
                                {/* <View className="w-16 h-16"></View> */}

                                {/* <View className="h-6 w-14 items-center justify-center flex-row">
                      <View style={{ backgroundColor: businessRating }} className="h-8 w-8 rounded-full ml-1"></View>
                    </View> */}
                            </View>
                            <View className="border-b border-b-ship-gray-100 ml-4 mr-4 mb-2"></View>
                        </>
                    ) : (
                        <View className="w-full flex-row justify-between">
                            <Text></Text>
                            <Text></Text>
                        </View>
                    )}
                    {/* Business name */}

                    {/* Business Account Section */}

                    <View className="m-4 rounded-lg flex flex-col p-2 bg-ship-gray-50">
                        {/* Edit Profile Option */}
                        <BaseButton onPress={() => {
                            router.push('homeBusiness/settings/editProfile');
                            switchSettingsOff()
                        }}>
                            <View className="border-b border-b-gray-200  justify-between flex-row">
                                <Text className="m-3 text-lg font-semibold text-ship-gray-900">Edit
                                    profile</Text>
                            </View>
                        </BaseButton>

                        {/* Teams Option */}
                        {isBusinessUserVerified && (
                            <BaseButton onPress={() => {
                                router.push('homeBusiness/settings/teams');
                                switchSettingsOff()
                            }}>
                                <View className="border-b border-b-gray-200  justify-between flex-row">
                                    <Text
                                        className="m-3 text-lg font-semibold text-ship-gray-900">Teams</Text>
                                </View>
                            </BaseButton>
                        )}

                        {/* Closed campaigns Option */}
                        <BaseButton onPress={() => {
                            router.push('homeBusiness/settings/closedCampaigns');
                            switchSettingsOff()
                        }}>
                            <View className="border-b border-b-gray-200  justify-between flex-row">
                                <Text className="m-3 text-lg font-semibold text-ship-gray-900">Closed
                                    Campaigns</Text>
                            </View>
                        </BaseButton>

                        {/* Closed promotions Option */}
                        <BaseButton onPress={() => {
                            router.push('homeBusiness/settings/closedPromotions');
                            switchSettingsOff()
                        }}>
                            <View className="border-b border-b-gray-200  justify-between flex-row">
                                <Text className="m-3 text-lg font-semibold text-ship-gray-900">Closed
                                    Promotions</Text>
                            </View>
                        </BaseButton>
                        <BaseButton onPress={() => {
                            router.push('homeBusiness/settings/about');
                            switchSettingsOff()
                        }}>
                            <View className="border-b border-b-gray-200">
                                <Text className="m-3 text-lg font-semibold text-ship-gray-900">About
                                    SwiftyBee</Text>
                            </View>
                        </BaseButton>
                        <BaseButton
                            onPress={() => {
                                Linking.openURL(`${MEDIA_URL}terms-of-use`);
                                switchSettingsOff()
                            }}>
                            <View className="border-b border-b-gray-200">
                                <Text className="m-3 text-lg font-semibold text-ship-gray-900">Terms Of
                                    Use</Text>
                            </View>
                        </BaseButton>
                        <BaseButton
                            onPress={() => {
                                Linking.openURL(`${MEDIA_URL}privacy-policy`);
                                switchSettingsOff()
                            }}>
                            <View>
                                <Text className="m-3 text-lg font-semibold text-ship-gray-900">Privacy
                                    Policy</Text>
                            </View>
                        </BaseButton>

                    </View>

                    <View>
                        {Platform.OS === 'android' && currentSubscription ?
                            <View className="m-4 rounded-lg flex flex-col p-2 bg-green-50 border border-green-200">
                                <BaseButton
                                    onPress={() => {
                                        switchSettingsOff()
                                        Linking.openURL(`https://play.google.com/store/account/subscriptions?package=app.ugem`);
                                    }}>
                                    <View className=" py-1 justify-between items-center flex-row">
                                        <Text
                                            className="mx-3 text-lg font-semibold text-ship-gray-900">Subscription</Text>
                                        <Text className={"text-base font-normal text-ship-gray-300"}>
                                            {subscriptionName(currentSubscription)}</Text>
                                    </View>
                                </BaseButton>
                            </View>
                            : Platform.OS === 'ios' && currentSubscription ?
                                <View className="m-4 rounded-lg flex flex-col p-2 bg-green-50 border border-green-200">
                                    <BaseButton
                                        onPress={() => {
                                            switchSettingsOff()
                                            Linking.openURL(`itms-apps://apps.apple.com/account/subscriptions`);
                                        }}>
                                        <View className=" py-1 justify-between items-center flex-row">
                                            <Text
                                                className="mx-3 text-lg font-semibold text-ship-gray-900">Subscription</Text>
                                            <Text className={"text-base font-normal text-ship-gray-300"}>
                                                {subscriptionName(currentSubscription)}</Text>

                                        </View>
                                    </BaseButton>
                                </View>
                                : !currentSubscription && isVIP ?
                                    <View
                                        className="m-4 rounded-lg flex flex-col p-2 bg-portage-50 border border-portage-200">
                                        <BaseButton
                                            onPress={() => {
                                                // checkUserSubscriptionStatus();
                                                // switchSettingsOff()
                                            }}>
                                            <View className=" py-1 justify-between items-center flex-row">
                                                <Text
                                                    className="mx-3 text-lg font-semibold text-ship-gray-900">Subscription
                                                </Text>
                                                <Text
                                                    className={"text-lg font-bold text-portage-400 mx-2"}>VIP</Text>
                                            </View>
                                        </BaseButton>
                                    </View>
                                    :
                                    <View
                                        className="m-4 rounded-lg flex flex-col p-2 bg-red-50 border border-red-200">
                                        <BaseButton
                                            onPress={() => {
                                                checkUserSubscriptionStatus();
                                                // switchSettingsOff()
                                            }}>
                                            <View className=" py-1 justify-between items-center flex-row">
                                                <Text
                                                    className="mx-3 text-lg font-semibold text-ship-gray-900">Subscription
                                                </Text>
                                                <Text className={"text-base font-normal text-ship-gray-300 mx-2"}> No
                                                    subscription</Text>
                                            </View>
                                        </BaseButton>
                                    </View>}
                    </View>

                    {/* QR Code Section */}
                    <Text className="ml-6 mt-4 text-base font-semibold text-ship-gray-400">Your Qr
                        Code</Text>
                    <View className="bg-tablebackground m-4 rounded-lg flex flex-col">
                        <View className="items-center justify-center">
                            <Image
                                source={{uri: `${MEDIA_URL}${businessUser.business_user_profile.qr_code}`}}
                                className="w-72 h-[300] mt-2 rounded-sm"
                                alt="qr code"
                            />
                        </View>
                        <Pressable onPress={() => setIsSendQr(true)}>
                            <View className="w-full items-center">
                                <Text className="mb-4 mt-4 text-base font-semibold text-zest-400">Send To My
                                    Email</Text>
                            </View>
                        </Pressable>
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

                    {/* Delete Account Option */}
                    <View className="m-4 rounded-lg flex flex-col p-2 bg-ship-gray-50">
                        <BaseButton
                            className="m-4 rounded-lg flex flex-col p-2 bg-ship-gray-50"
                            onPress={() => {
                                setIsConfirmDelete(true);
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                            }}>
                            <View className="w-full items-center">
                                <View>
                                    {isLoading ? <SaveLoader/> :
                                        <Text className="m-2 text-lg font-semibold text-ship-gray-900">Delete
                                            Account</Text>}
                                </View>
                            </View>
                        </BaseButton>
                    </View>

                    {/* Spacing at the bottom of the screen */}
                    <View className="h-20"></View>
                </View>
                {/*</Pressable>*/}
            </ScrollView>

            {/* Confirm Deletion Modal */}
            <BottomModal
                key={"confirmDeleteBusinessModal"}
                style={{zIndex: 2}}
                visible={isConfirmDelete}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <ConfirmDeletion OnDeletionConfirmed={OnDeletionConfirmed} setIsConfirmDelete={setIsConfirmDelete}/>
            </BottomModal>

            {/* Delete Account Modal */}
            <BottomModal
                key={"deleteAccountBusinessModal"}
                style={{zIndex: 2}}
                visible={isDeleteAccount}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <DeleteAccount setIsDeleteAccount={setIsDeleteAccount}/>
            </BottomModal>

            {/* Log Out Confirmation Modal */}
            <BottomModal
                key={"confirmLogOutBusinessModal"}
                style={{zIndex: 2}}
                visible={isLogOut}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <ConfLogOut setIsLogOut={setIsLogOut}/>
            </BottomModal>

            {/* Send QR Code Confirmation Modal */}
            <BottomModal
                key={"sendQRModal"}
                style={{zIndex: 2}}
                visible={isSendQr}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <ConfSendQr setIsSendQr={setIsSendQr}/>
            </BottomModal>
            <BottomModal
                onTouchOutside={() => {
                    setIsSwitchProfile(false);
                }}
                key={"switcher-modal"}
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
