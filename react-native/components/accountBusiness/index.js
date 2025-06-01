import {Dimensions, Keyboard, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useRef, useState} from "react";
import {useMMKVBoolean} from "react-native-mmkv";

// Expo Libraries
import * as Haptics from "expo-haptics";
import {Entypo} from "@expo/vector-icons";

// Custom Components
import Modal, {SlideAnimation} from "react-native-modals";
import CampaignsSection from "../commonComponents/campaigns";
import PromotionsSection from "./promotions";
import MessagesSection from "./wallMessages";

// MMKV Storage and API Functions
import {getBusinessMMKV, saveBusinessMMKV} from "../../MMKV/mmkvBusiness/user";
import {GetMeUser} from "../../axios/axiosBusiness/businessAuth";
import {GetWallMessages, SendMessage} from "../../axios/axiosBusiness/wallMessage";
import {saveWallMessages} from "../../MMKV/mmkvBusiness/wallMessages";
import {GetOpenCampaigns} from "../../axios/axiosBusiness/campaign";
import {saveCampaignsMMKV} from "../../MMKV/mmkvBusiness/campaigns";
import {GetOpenPromotions} from "../../axios/axiosBusiness/promotions";
import {saveMyPromotionsMMKV} from "../../MMKV/mmkvBusiness/promotions";
import {authStorage} from "../../MMKV/auth";
import {controlStorage} from "../../MMKV/control";
import {getRatingColor} from "./businessRating";
import {colors} from "../../constants/colors";

// import SVGs
import PostMessage from "./wallMessages/postMessage";
import VerifyBusinessUser from "../login/verifyBusinessUser"
import BusinessHeader from "./header";
import {router} from "expo-router";
import {hasPermission} from "../../utils/auth";
import {useRevenueCatContext} from "../../utils/RCWrapper";
import {RefreshControl, ScrollView} from "react-native-gesture-handler";

export default function AccountTab() {
    // Retrieve access token and business user data from storage
    const accessToken = authStorage.getString("accessToken");
    const businessUser = getBusinessMMKV();
    const isBusinessUserVerified = businessUser.business_user_profile.is_verified;

    // State variables
    const [visibleKeyboard, setVisibleKeyboard] = useState(false); // Keyboard visibility state
    const [wallMessage, setWallMessage] = useState(""); // Message input for the wall
    const [isSaving, setIsSaving] = useState(false); // Loading state for sending message
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
    const [verifyBusinessUser, setVerifyBusinessUser] = useState(false); // State for pull-to-refresh
    const [businessRating, setBusinessRating] = useState("#000"); // Business rating color

    // MMKV booleans for modals
    const [refreshBusinessFeed, setRefreshBusinessFeed] = useMMKVBoolean("refreshBusinessFeed", controlStorage);

    const {
        checkUserSubscriptionStatus,
        currentSubscription
    } = useRevenueCatContext()

    // Refs for scroll views
    const scrollViewRefVertical = useRef(null);

    const messageRef = useRef(null);

    // Fetch user data on component mount
    useEffect(() => {
        const getAccount = async () => {
            try {
                const userData = await GetMeUser(accessToken); // Fetch user data from API
                saveBusinessMMKV(userData); // Save user data to MMKV storage
                setBusinessRating(getRatingColor(userData.business_user_profile.user_rating)); // Set rating color
            } catch (error) {
                console.log(error);
            }
        };
        getAccount();
    }, []);

    // Keyboard event listeners
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setVisibleKeyboard(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setVisibleKeyboard(false);
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // Scroll to bottom when keyboard is visible
    useEffect(() => {
        // console.log(messageRef.current.isFocused())
        if (visibleKeyboard & messageRef.current.isFocused()) {
            setTimeout(() => {
                scrollViewRefVertical.current?.scrollToEnd({animated: true});
            }, 100);
        }
    }, [visibleKeyboard]);

    // Function to send a wall message
    const onMessageSend = async () => {
        setIsSaving(true);
        if (!wallMessage) {
            setIsSaving(false);
            return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // Haptic feedback for error
        }

        try {
            await SendMessage(accessToken, wallMessage); // Send message to API
            const messages = await GetWallMessages(accessToken); // Fetch updated messages
            saveWallMessages(messages); // Save messages to MMKV storage
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Haptic feedback for success
            setWallMessage(""); // Clear input
        } catch (error) {
            console.log(error);
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        onRefresh()
    }, [refreshBusinessFeed])

    // Refresh handler for pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const userData = await GetMeUser(accessToken);
            const messages = await GetWallMessages(accessToken);
            const campaigns = await GetOpenCampaigns(accessToken);
            const promotions = await GetOpenPromotions(accessToken);

            saveBusinessMMKV(userData);
            saveWallMessages(messages);
            saveCampaignsMMKV("openCampaigns", campaigns);
            saveMyPromotionsMMKV("openPromotions", promotions);

            setBusinessRating(getRatingColor(userData.business_user_profile.user_rating));
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false);
        }
    };

    // // Open and close account settings modal
    // const openSettings = () => {
    //     setIsAccountSettings(true);
    //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // };
    // const closeSettings = () => {
    //     setIsAccountSettings(false);
    //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // };

    return (
        <>
            <BusinessHeader setVerifyBusinessUser={setVerifyBusinessUser}></BusinessHeader>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                ref={scrollViewRefVertical}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={true}/>}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true} // Ensures that the scroll is enabled
                nestedScrollEnabled={true} // Enable nested scroll
                className="bg-white w-screen flex-1 pt-8 p-4">
                {/* <TouchableOpacity activeOpacity={0.99}> */}
                <View className="justify-between ">
                    {!isBusinessUserVerified &&
                        <View className="bg-orange-50 rounded-lg border border-orange-300 mb-4">
                            <View className={'p-3'}>
                                <Text className={'text-base text-ship-gray-900 '}>
                                    Verify your <Text
                                    className={'font-bold'}>email</Text>. A verification link has been sent to your
                                    email address.
                                </Text>
                            </View>
                        </View>}
                    {!hasPermission(businessUser.business_user_profile, currentSubscription) &&
                        <View className="bg-orange-50 rounded-lg border border-orange-300 mb-4">
                            <View className={'p-3'}>
                                <Text className={'text-base text-ship-gray-900 '}>

                                    Currently, you don't have an active <Text
                                    className={'font-bold'}>subscription</Text>. Without it, you won't be able to
                                    access uGem <Text
                                    className={'font-bold'}>features</Text>, and customers won't be able to find you on
                                    the map.
                                </Text>
                            </View>
                        </View>}
                    <View>
                        <View></View>
                    </View>
                    <View className="flex-row justify-between">
                        <View className="h-[65] w-[65]"></View>
                        <View className="h-[65] w-[65]"></View>
                        {isBusinessUserVerified ? (
                            <TouchableOpacity onPress={() => router.push('homeBusiness/features/addCampaign')}
                                              className="items-center">
                                <View
                                    style={styles.shadow}
                                    className="h-[65] w-[65] mb-1 bg-white border border-ship-gray-200 rounded-md items-center justify-center">
                                    <Entypo name="plus" size={32} color="#292524"/>
                                </View>
                                <Text className="text-xs text-normaltext">Campaign</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => setVerifyBusinessUser(true)} className="items-center">
                                <View
                                    style={styles.shadow}
                                    className="h-[65] w-[65] mb-1 bg-white border border-ship-gray-200 rounded-md items-center justify-center">
                                    <Entypo name="plus" size={32} color="#292524"/>
                                </View>
                                <Text className="text-xs text-normaltext">Campaign</Text>
                            </TouchableOpacity>
                        )}

                        {isBusinessUserVerified ? (
                            <TouchableOpacity onPress={() => router.push('homeBusiness/features/addPromotion')}
                                              className="items-center">
                                <View
                                    style={styles.shadow}
                                    className="h-[65] w-[65] mb-1 bg-white border border-ship-gray-200 rounded-md items-center justify-center">
                                    <Entypo name="plus" size={32} color="#292524"/>
                                </View>
                                <Text className="text-xs text-normaltext">Promotion</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => setVerifyBusinessUser(true)} className="items-center">
                                <View
                                    style={styles.shadow}
                                    className="h-[65] w-[65] mb-1 bg-white border border-ship-gray-200 rounded-md items-center justify-center">
                                    <Entypo name="plus" size={32} color="#292524"/>
                                </View>
                                <Text className="text-xs text-normaltext">Promotion</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View className="">
                    {/* Business details container */}
                    <CampaignsSection onRefresh={onRefresh}/>
                    <PromotionsSection onRefresh={onRefresh}/>

                    {/* Wall messages display section */}
                    <MessagesSection/>

                    {/* Wall message input section */}

                    <View className="mb-16">
                        <PostMessage
                            wallMessage={wallMessage}
                            setWallMessage={setWallMessage}
                            onMessageSend={onMessageSend}
                            isSaving={isSaving}
                            messageRef={messageRef}
                        />
                    </View>

                    {/* Placeholder for keyboard visibility adjustment */}
                    {visibleKeyboard && <View className="h-80"></View>}
                </View>
            </ScrollView>

            <Modal
                key={"verifyBusiness"}
                style={{zIndex: 2}}
                visible={verifyBusinessUser}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "top",
                    })
                }>
                <View className="flex-1 w-full h-screen">
                    <VerifyBusinessUser setVerifyBusinessUser={setVerifyBusinessUser} onRefresh={onRefresh}/>
                </View>
            </Modal>

        </>
    );
}

// Styles
const styles = StyleSheet.create({
    shadow: {
        shadowColor: colors["ship-gray"][700],
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 2,
    },
    photoHeight: {
        height: Dimensions.get("window").width * 0.45,
    },
});
