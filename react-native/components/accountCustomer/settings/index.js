import {Linking, StyleSheet, Text, View} from "react-native";
import {useRef, useState} from "react";
import {BottomModal, Modal, SlideAnimation} from "react-native-modals";
import * as Haptics from "expo-haptics";

// Import custom components and modals
import SaveLoader from "../../smallComponents/smLoader";
import ConfLogOut from "./confLogOut";
import ConfirmDeletion from "./deleteAccount/confirm";
import DeleteAccount from "./deleteAccount/delete";
import About from "./about";
import Teams from "./teams";
import {MaterialCommunityIcons} from "@expo/vector-icons";

import SwitchProfile from "../../../app/switcher/index";
import {BaseButton, ScrollView} from "react-native-gesture-handler";
import {colors} from "../../../constants/colors";
import {getCustomerMMKV} from "../../../MMKV/mmkvCustomer/user";
import {MEDIA_URL} from "../../../utils/CONST";
import {router} from "expo-router";

export default function AccountSettings({switchSettingsOff, closeSettings}) {
    // Retrieve business user data from storage
    const customerUser = getCustomerMMKV();
    console.log(customerUser.is_business)
    const isCustomerVerified = getCustomerMMKV() ? customerUser.customer_user_profile.is_verified : false;

    // State variables to control visibility of various modals and loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isLogOut, setIsLogOut] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [isDeleteAccount, setIsDeleteAccount] = useState(false);
    const [isAbout, setIsAbout] = useState(false);
    const [isTeams, setIsTeams] = useState(false);
    const [isSwitchProfile, setIsSwitchProfile] = useState(false);


    // Function to handle account deletion confirmation
    const OnDeletionConfirmed = () => {
        setIsConfirmDelete(false);
        setIsDeleteAccount(true);
    };


    const scrollViewRef = useRef();

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef}
                        className="h-screen w-full pt-10 ">


                <View className="w-full">
                    {isCustomerVerified ? (
                        <>
                            {/* Switch profile */}
                            <BaseButton
                                onPress={() => {
                                    setIsSwitchProfile(true);
                                    switchSettingsOff()
                                }}
                            >
                                <View className="items-center flex-row w-full">
                                    <View className="pl-5 w-10/12 mt-3 items-start justify-center h-14">
                                        <Text className=" text-zest-400 font-semibold text-base">Switch profile</Text>
                                        <Text className=" text-xl text-left font-semibold text-ship-gray-900 ">
                                            {customerUser.customer_user_profile.nickname}
                                        </Text>
                                    </View>
                                    <View className="items-end pr-6 mt-4 w-2/12">
                                        <MaterialCommunityIcons name="dots-horizontal" size={30}
                                                                color={colors.zest["400"]}/>
                                    </View>
                                </View>
                            </BaseButton>
                            <View className="border-b border-b-ship-gray-100 ml-4 mr-4 mb-2"></View>
                        </>
                    ) : (
                        <View className="w-full flex-row justify-between">
                            <Text></Text>
                            <Text></Text>
                        </View>
                    )}
                    {!customerUser.is_business &&
                        <BaseButton onPress={() => {
                            setIsSwitchProfile(true);
                            switchSettingsOff()
                        }}>
                            <View className="bg-zest-50 rounded-lg border-2 border-zest-300 m-4">
                                <View className={'p-3'}>
                                    <Text className={'text-base font-semibold text-zest-400 '}>
                                        Start growing your business today!
                                    </Text>
                                </View>
                            </View>
                        </BaseButton>}

                    <View className="m-4 rounded-lg flex flex-col p-2 bg-ship-gray-50">
                        {/* Edit Profile Option */}
                        {isCustomerVerified && (
                            <BaseButton onPress={() => {
                                router.push('homeCustomer/settings/editProfile');
                                switchSettingsOff()
                            }}>
                                <View className="border-b border-b-gray-200  justify-between flex-row">
                                    <Text className="m-3 text-lg font-semibold text-ship-gray-900">Edit
                                        profile</Text>
                                </View>
                            </BaseButton>
                        )}

                        {/* Teams Option */}
                        {isCustomerVerified && (
                            <BaseButton onPress={() => {
                                router.push('homeCustomer/settings/teams');
                                switchSettingsOff()
                            }}>
                                <View className="border-b border-b-gray-200  justify-between flex-row">
                                    <Text
                                        className="m-3 text-lg font-semibold text-ship-gray-900">Teams</Text>
                                </View>
                            </BaseButton>
                        )}

                        <BaseButton onPress={() => {
                            router.push('homeCustomer/settings/about');
                            switchSettingsOff()
                        }}>
                            <View className="border-b border-b-gray-200">
                                <Text className="m-3 text-lg font-semibold text-ship-gray-900">About
                                    uGem</Text>
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
            </ScrollView>

            {/* About Modal */}
            <Modal
                key={"aboutCustomerModal"}
                style={{zIndex: 2}}
                visible={isAbout}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <About setIsAbout={setIsAbout}/>
            </Modal>

            {/* Confirm Deletion Modal */}
            <BottomModal
                key={"confirmDeleteCustomerModal"}
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
                key={"deleteCustomerModal"}
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
                key={"logOutCustomerModal"}
                style={{zIndex: 2}}
                visible={isLogOut}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <ConfLogOut setIsLogOut={setIsLogOut} closeSettings={closeSettings}/>
            </BottomModal>

            <Modal
                key={"teamsCustomerModal"}
                style={{zIndex: 2}}
                visible={isTeams}
                animationDuration={50}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "right",
                    })
                }>
                <Teams setIsTeams={setIsTeams}/>
            </Modal>
            {/* SwitchAccount modal */}
            <BottomModal
                key={"switchProfileCustomerModal"}
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
