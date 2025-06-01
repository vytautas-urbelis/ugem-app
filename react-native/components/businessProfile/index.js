import {useEffect, useState} from "react";
import {Dimensions, Image, Linking, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FollowBusiness, GetBusiness, SubscriBusiness} from "../../axios/axiosCustomer/business";
import {colors} from "../../constants/colors";
import {AntDesign, Feather, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import FollowButton from "./followButton";
import SubscribeButton from "./subscribeButton";

import {GestureHandlerRootView, ScrollView} from "react-native-gesture-handler";
import Map from "./map";
import ActiveCampaignsView from "./campaigns";

import * as Haptics from "expo-haptics";
import ActivePromotionsView from "./promotions";
import WallMessagesBusinessProfile from "./wallMessages";
import {BottomModal, SlideAnimation} from "react-native-modals";
import SideMenu from "./sideMenu";
import {authStorage} from "../../MMKV/auth";
import {router} from "expo-router";
import {getCustomerMMKV} from "../../MMKV/mmkvCustomer/user";
import {shorterText} from "../../utils/textFormating";

const BusinessProfile = ({businessId, fromMap = false}) => {
    const [businessProfile, setBusinessProfile] = useState(null);
    const [isMapModal, setIsMapModal] = useState(false);
    const [isSideMenuModal, setIsSideMenuModal] = useState(false);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [businessName, setBusinessName] = useState("");

    const accessToken = authStorage.getString("accessToken");

    const customerProfile = getCustomerMMKV()

    const isCustomerVerified = customerProfile.customer_user_profile.is_verified

    const scheme = Platform.select({ios: "maps://0,0?q=", android: "geo:0,0?q="});
    const latLng = `${latitude},${longitude}`;
    const label = businessName;
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
    });

    const toggleFollow = async () => {
        try {
            const updatedProfile = {...businessProfile};
            updatedProfile["following"] = !businessProfile.following;
            setBusinessProfile(updatedProfile);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const res = await FollowBusiness(businessId, accessToken);
            setBusinessProfile(res);
        } catch (error) {
            dots;
            console.log(error);
        } finally {
        }
    };

    const toggleSubscribe = async () => {
        try {
            const updatedProfile = {...businessProfile};
            updatedProfile["subscribing"] = !businessProfile.subscribing;
            setBusinessProfile(updatedProfile);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const res = await SubscriBusiness(businessId, accessToken);
            setBusinessProfile(res);
        } catch (error) {
            console.log(error);
        } finally {
        }
    };

    const screenWidth = Dimensions.get("window").width * 0.6;

    useEffect(() => {
        const getBusinessProfile = async () => {
            try {
                const businessProfile = await GetBusiness(businessId, accessToken);
                setBusinessProfile(businessProfile);
                setTimeout(() => {
                    setLongitude(parseFloat(businessProfile.business_user_profile.longitude));
                    setLatitude(parseFloat(businessProfile.business_user_profile.latitude));
                }, 350);

                setBusinessName(businessProfile.business_user_profile.business_name);
            } catch (error) {
                console.log(error);
            } finally {
            }
        };
        getBusinessProfile();
    }, []);

    const openMaps = () => {
        // setIsMapModal(true);
        router.navigate({
            pathname: "/homeCustomer/maps",
            params: {latitude: latitude, longitude: longitude, givenBusinessId: businessId}
        })
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const closeMaps = () => {
        setIsMapModal(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    return (
        <GestureHandlerRootView>
            <View
                className="w-full h-28 bg-white justify-center items-center border-b border-b-ship-gray-100">

                <TouchableOpacity
                    onPress={() => {
                        // setIsBusinessProfile(false);
                        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                        router.back()
                    }}
                    className="w-16 h-16 items-start justify-center absolute top-12 left-4">
                    <Feather name="chevron-left" size={24} color={colors["ship-gray"]["800"]}/>
                </TouchableOpacity>
                {businessProfile &&
                    <>{isCustomerVerified ?
                        <TouchableOpacity
                            onPress={() => {
                                setIsSideMenuModal(true);
                            }}
                            className="mt-10 flex-row">
                            <Text
                                className="text-3xl font-bold text-normaltext">{shorterText(businessProfile.business_user_profile.business_name, 16)} </Text>
                            <View className="flex-row">
                                <View className="  justify-center items-center flex-row gap-1">
                                    {/* <Ionicons name="ticket-outline" size={24} color="black" /> */}
                                    <AntDesign name="star" size={20} color={colors["zest"][400]}/>
                                    <Text
                                        className="text-lg font-semibold text-ship-gray-600 text-center">{businessProfile.rating.toFixed(1)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        :
                        <View
                            // onPress={() => {
                            //     setIsSideMenuModal(true);
                            // }}
                            className="mt-10 flex-row">
                            <Text
                                className="text-3xl font-bold text-normaltext">{shorterText(businessProfile.business_user_profile.business_name, 18)} </Text>
                            <View className="flex-row">
                                <View className="  justify-center items-center flex-row gap-1">
                                    {/* <Ionicons name="ticket-outline" size={24} color="black" /> */}
                                    <AntDesign name="star" size={20} color={colors["zest"][400]}/>
                                    <Text
                                        className="text-lg font-semibold text-ship-gray-600 text-center">{businessProfile.rating.toFixed(1)}</Text>
                                </View>
                            </View>
                        </View>}</>}

            </View>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 w-screen h-screen bg-white">
                <Pressable>
                    {businessProfile && (
                        <>
                            <View className="w-full">
                                {businessProfile.business_user_profile.shop_image ? (
                                    <Image
                                        style={{height: screenWidth, width: "100%"}}
                                        source={{uri: businessProfile.business_user_profile.shop_image}}
                                        className=""
                                        alt="qr code"
                                    />
                                ) : (
                                    <View style={{height: screenWidth, width: "100%"}}
                                          className="items-center justify-center bg-ship-gray-200"></View>
                                )}
                            </View>
                            <View style={{top: screenWidth - 42, left: 20}} className="absolute">
                                <View style={styles.shadow} className="w-24 h-24 bg-white rounded-lg">
                                    {businessProfile.business_user_profile.logo ? (
                                        <Image source={{uri: businessProfile.business_user_profile.logo}}
                                               className="w-24 h-24 rounded-lg " alt="qr code"/>
                                    ) : (
                                        <View
                                            className="w-24 h-24 items-center justify-center bg-ship-gray-200 rounded-lg">
                                            <Text className="text-4xl font-semibold">
                                                {businessProfile.business_user_profile.business_name.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View className="w-full flex-row mt-2 items-start justify-start px-3">
                                <View className="w-24"></View>

                                {/* <Image className="w-32 h-32 rounded-lg " source={{ url: businessProfile.business_user_profile.logo }}></Image> */}
                                <View className="flex-grow">
                                    <View className="flex-row ml-6  flex-grow justify-between">
                                        <View className="gap-8 flex-row">
                                            <View className="  justify-center items-center">
                                                <MaterialCommunityIcons name="account-outline" size={20}
                                                                        color={colors["ship-gray"][700]}/>
                                                <Text className="text-sm font-semibold text-ship-gray-600 text-center">
                                                    {businessProfile.business_user_profile.followers_number}
                                                </Text>
                                            </View>
                                            <View className="  justify-center items-center">
                                                <MaterialCommunityIcons name="heart" size={20}
                                                                        color={colors["ship-gray"][700]}/>
                                                <Text className="text-sm font-semibold text-ship-gray-600 text-center">
                                                    {businessProfile.business_user_profile.hearts_number}
                                                </Text>
                                            </View>
                                            <View className="  justify-center items-center">
                                                <MaterialIcons name="card-giftcard" size={20}
                                                               color={colors["ship-gray"][700]}/>
                                                <Text className="text-sm font-semibold text-ship-gray-600 text-center">
                                                    {businessProfile.business_user_profile.issued_vouchers}
                                                </Text>
                                            </View>
                                            {/* <View className="w-16 h-16"></View> */}

                                            {/* <View className="h-6 w-14 justify-center flex-row">
                      <View style={{ backgroundColor: businessRating }} className="h-8 w-8 rounded-full ml-1"></View>
                    </View> */}
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className="w-full mt-2  items-start flex-row justify-between px-6">
                                <View className="flex-shrink">
                                    <Text className="text-2xl text-ship-gray-900 font-semibold flex-wrap flex-shrink">
                                        {businessProfile.business_user_profile.business_name}
                                    </Text>
                                    {businessProfile.business_user_profile.website &&
                                        <View className="w-full mt-1">
                                            <TouchableOpacity
                                                onPress={() => Linking.openURL(businessProfile.business_user_profile.website)}>
                                                {/* <Text className="text-sm text-ship-gray-900 text-decoration-line: underline">Website</Text> */}
                                                <AntDesign name="link" size={24} color="black"/>
                                            </TouchableOpacity>
                                        </View>}

                                </View>

                                <View className="flex-row">
                                    {/*{!businessProfile.subscribing && (*/}
                                    <SubscribeButton
                                        toggleSubscribe={toggleSubscribe}
                                        businessId={businessId}
                                        businessProfile={businessProfile}
                                        setBusinessProfile={setBusinessProfile}
                                    />
                                    {/*)}*/}
                                    {/*{!businessProfile.following && (*/}
                                    <FollowButton
                                        toggleFollow={toggleFollow}
                                        businessId={businessId}
                                        businessProfile={businessProfile}
                                        setBusinessProfile={setBusinessProfile}
                                    />
                                    {/*)}*/}
                                </View>
                            </View>
                            <View className="mt-8 px-6">
                                <Text className="text-base text-ship-gray-900 font-semibold">About us</Text>
                                <Text
                                    className="text-base text-ship-gray-700  ">{businessProfile.business_user_profile.about}</Text>
                            </View>
                            <View className="mt-8 px-3">
                                <WallMessagesBusinessProfile
                                    messages={businessProfile.business_user_profile.business_wall}
                                    businessProfile={businessProfile.business_user_profile}></WallMessagesBusinessProfile>
                                <ActiveCampaignsView businessId={businessId}></ActiveCampaignsView>
                                <ActivePromotionsView
                                    businessProfile={businessProfile.business_user_profile}
                                    businessId={businessId}></ActivePromotionsView>
                                {!fromMap & (latitude !== null) & (longitude !== null) && (
                                    <>{(businessProfile.business_user_profile.is_vip || businessProfile.business_user_profile.subscription) &&
                                        <Pressable onPress={openMaps}>
                                            <Map latitude={latitude} longitude={longitude} url={url}></Map>
                                        </Pressable>}
                                    </>
                                )}
                                <View className="h-20"></View>
                            </View>
                        </>
                    )}
                </Pressable>
            </ScrollView>
            <BottomModal
                onTouchOutside={() => {
                    setIsSideMenuModal(false);
                }}
                key={"SideMenuBusinessProfile"}
                style={{zIndex: 10}}
                visible={isSideMenuModal}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <SideMenu
                    toggleSubscribe={toggleSubscribe}
                    toggleFollow={toggleFollow}
                    businessProfile={businessProfile}
                    setBusinessProfile={setBusinessProfile}
                    businessId={businessId}
                    setIsSideMenuModal={setIsSideMenuModal}
                />
            </BottomModal>
        </GestureHandlerRootView>
    );
};

export default BusinessProfile;

// Styles
const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 1.84,
        elevation: 2,
    },
    photoHeight: {
        height: Dimensions.get("window").width * 0.45,
    },
});
