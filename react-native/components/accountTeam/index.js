import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, RefreshControl, Image} from "react-native";
import {useRef, useState} from "react"; // Import React hooks

import * as Haptics from "expo-haptics"; // Import Haptics for feedback

// Importing custom components
import CampaignsSection from "../commonComponents/campaigns";
import AccountSettings from "./settings";
import {authStorage} from "../../MMKV/auth";

import UGEM from "../../assets/svg/uGem.svg";
import {colors} from "../../constants/colors";
import {Modal, SlideAnimation} from "react-native-modals";
import {getTeamProfileMMKV} from "../../MMKV/mmkvTeams";
import {GetOpenTeamCampaigns} from "../../axios/axiosTeams/campaign";
import {saveTeamsCampaignsMMKV} from "../../MMKV/mmkvTeams/campaigns";
import {MEDIA_URL} from "../../utils/CONST";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../MMKV/control";

export default function AccountTabTeam() {
    // User and business information
    const accessToken = authStorage.getString("accessToken");
    const teamBusinessUser = getTeamProfileMMKV();

    // State variables
    const [refreshing, setRefreshing] = useState(false); // State to track component refreshing
    const [isAccountTeamSettings, setIsAccountTeamSettings] = useMMKVBoolean('isAccountTeamSettings', controlStorage)

    // Refs for scroll views
    const scrollViewRefVertical = useRef(null);

    // // On component refresh
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const campaigns = await GetOpenTeamCampaigns(accessToken, teamBusinessUser.user_id); // Fetch wall messages
            saveTeamsCampaignsMMKV("openCampaigns", campaigns); // Save campaigns locally
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false);
        }
    };


    // Open and close account settings modal
    const openCloseSettings = () => {
        setIsAccountTeamSettings(!isAccountTeamSettings);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // UI Component rendering
    return (
        <><View className="h-10 bg-ship-gray-50 w-full"></View>
            <View
                className="flex-row w-full justify-between pl-5 pr-5 pb-1 bg-ship-gray-50 border-b border-ship-gray-100">
                <View className="w-[100%] h-16 justify-center items-center">
                    <UGEM width={80} height={24} fill={colors.zest["400"]}/>
                </View>

                <View className="absolute left-5 top-1">
                    <TouchableOpacity onPress={openCloseSettings} className="items-end justify-end h-16 ">
                        {teamBusinessUser.logo ? (
                            <>
                                <Image source={{uri: `${MEDIA_URL}${teamBusinessUser.logo}`}}
                                       className="w-12 h-12 mt-1 rounded-full " alt="qr code"/>
                                <Text className="text-sm w-full text-center text-shamrock-500">Teams</Text>
                            </>
                        ) : (
                            <>
                                <View className="w-12 h-12 items-center justify-center bg-ship-gray-200 rounded-full">
                                    <Text
                                        className="text-2xl font-semibold">{teamBusinessUser.business_name.charAt(0).toUpperCase()}</Text>
                                </View>
                                <Text className="text-sm w-full text-center text-shamrock-500">Teams</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                ref={scrollViewRefVertical}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={true}/>}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true} // Ensures that the scroll is enabled
                nestedScrollEnabled={true} // Enable nested scroll
                className="bg-white w-screen flex-1">
                {/* <TouchableOpacity activeOpacity={0.99}> */}
                <View className=" pl-3 pr-3">
                    {/* Business details container */}
                    <CampaignsSection/>
                </View>
            </ScrollView>

        </>
    );
}

// Styles
// const styles = StyleSheet.create({
//     shadow: {
//         shadowColor: "#000",
//         shadowOffset: {width: 0, height: 1},
//         shadowOpacity: 0.1,
//         shadowRadius: 1.84,
//         elevation: 2,
//     },
//     photoHeight: {
//         height: Dimensions.get("window").width * 0.45,
//     },
// });
