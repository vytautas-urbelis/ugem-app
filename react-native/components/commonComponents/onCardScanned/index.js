import {Text, TouchableOpacity, View} from "react-native";
import {getCampaignsMMKV} from "../../../MMKV/mmkvBusiness/campaigns";

import Campaign from "./campaign";
import {router} from "expo-router";
import {authStorage} from "../../../MMKV/auth";
import {GestureHandlerRootView, ScrollView} from "react-native-gesture-handler";
import {useEffect, useState} from "react";
import {controlStorage} from "../../../MMKV/control";
import {getTeamsCampaignsMMKV} from "../../../MMKV/mmkvTeams/campaigns";

const OnCardScanned = ({secretKey}) => {
    // Check is business user or team user in controll
    const isUserLogedInAsTeam = controlStorage.getBoolean("teamProfile");

    // Checking if user loged in as Team member, if so then load teams campaigns, else his own campaigns
    const openCampaigns = isUserLogedInAsTeam ? getTeamsCampaignsMMKV("openCampaigns") : getCampaignsMMKV("openCampaigns");

    const [numberOfCampaigns, setNumberOfCampiagns] = useState(openCampaigns.length);

    useEffect(() => {
        if (numberOfCampaigns === 0) {
            if (isUserLogedInAsTeam) {
                router.replace("/homeTeam/scann");
                // router.back()
            } else {
                router.replace("/homeBusiness/scann");
                // router.back()
            }
        }
    }, [numberOfCampaigns]);

    const accessToken = authStorage.getString("accessToken");

    return (
        <>
            <GestureHandlerRootView>
                <ScrollView showsVerticalScrollIndicator={false} pagingEnabled={true} className=" bg-ship-gray-50">
                    <View className="pt-16">
                        {openCampaigns.map((campaign) => (
                            <Campaign
                                isUserLogedInAsTeam={isUserLogedInAsTeam}
                                key={campaign.id}
                                campaign={campaign}
                                secretKey={secretKey}
                                numberOfCampaigns={numberOfCampaigns}
                                setNumberOfCampiagns={setNumberOfCampiagns}
                            />
                        ))}
                    </View>
                </ScrollView>
            </GestureHandlerRootView>
            <TouchableOpacity
                className="items-center justify-center h-24"
                onPress={async () => {
                    if (isUserLogedInAsTeam) {
                        // router.replace("/homeTeam");
                        router.back()
                    } else {
                        // router.replace("/homeBusiness");
                        router.back()
                    }
                }}>
                <Text className="text-center text-ship-gray-900 font-semibold text-xl ">Go back</Text>
            </TouchableOpacity>
        </>
    );
};

export default OnCardScanned;
