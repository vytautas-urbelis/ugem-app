import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, ScrollView} from "react-native";
import {authStorage} from "../../../../MMKV/auth";
import {GetClosedCampaigns} from "../../../../axios/axiosBusiness/campaign";
import {getCampaignsMMKV, saveCampaignsMMKV} from "../../../../MMKV/mmkvBusiness/campaigns";
import ClosedCampaign from "./closedCampaign";
import {router} from "expo-router";

const ClosedCampaigns = () => {
    const [isLoading, setIsLoading] = useState(false);

    const accessToken = authStorage.getString("accessToken");

    const closedCampaigns = getCampaignsMMKV("closedCampaigns") ? getCampaignsMMKV("closedCampaigns") : [];

    useEffect(() => {
        setIsLoading(true);
        const fetchClosedCampaigns = async () => {
            try {
                const getClosedCampaigns = await GetClosedCampaigns(accessToken);
                saveCampaignsMMKV("closedCampaigns", getClosedCampaigns);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClosedCampaigns();
    }, []);


    return (
        <>
            <View className="flex-1 justify-center items-center">
                <TouchableOpacity activeOpacity={0.99}>
                    <View
                        className="pl-4 h-16 pb-4 items-center flex-row justify-between bg-tablebackground mt-10 border-b border-b-ship-gray-200">
                        <Text className="text-3xl font-bold text-normaltext">Closed campaigns</Text>
                        <TouchableOpacity className="mr-6 items-center justify-center h-16 pt-4"
                                          onPress={() => router.back()}>
                            <Text className="text-lg pb-3 text-normaltext">Done</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView className="h-screen w-screen bg-background px-4 bg-ship-gray-50">
                        <View className="flex-1 w-full">
                            {isLoading ? (
                                <View className="h-screen"></View>
                            ) : (
                                <View className="mt-4 w-full h-full">
                                    {closedCampaigns.length !== 0 ? (
                                        <View className="">
                                            {closedCampaigns.map((campaign, index) => (
                                                <ClosedCampaign key={campaign.id} campaign={campaign}
                                                                index={index}/>
                                            ))}
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default ClosedCampaigns;
