import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, ScrollView} from "react-native";
import {authStorage} from "../../../../MMKV/auth";
import {getMyPromotionsMMKV, saveMyPromotionsMMKV} from "../../../../MMKV/mmkvBusiness/promotions";
import {GetClosedPromotions} from "../../../../axios/axiosBusiness/promotions";
import ClosedPromotion from "./closedPromotion";
import {router} from "expo-router";

const ClosedPromotions = () => {
    const [isLoading, setIsLoading] = useState(false);

    const accessToken = authStorage.getString("accessToken");

    const closedPromotions = getMyPromotionsMMKV("closedPromotions") ? getMyPromotionsMMKV("closedPromotions") : [];

    useEffect(() => {
        setIsLoading(true);
        const fetchClosedPromotions = async () => {
            try {
                const getClosedPromotions = await GetClosedPromotions(accessToken);
                saveMyPromotionsMMKV("closedPromotions", getClosedPromotions);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClosedPromotions();
    }, []);

    return (
        <>
            <View className="flex-1 justify-center items-center">
                <TouchableOpacity activeOpacity={0.99}>
                    <View
                        className="pl-4 h-16 pb-4 items-center flex-row justify-between bg-tablebackground mt-10 border-b border-b-ship-gray-200">
                        <Text className="text-3xl font-bold text-normaltext">Closed promotions</Text>
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
                                    {closedPromotions.length !== 0 ? (
                                        <View className="">
                                            {closedPromotions.map((promotion, index) => (
                                                <ClosedPromotion key={promotion.id} promotion={promotion}
                                                                 index={index}/>
                                                // <View key={campaign.id}>
                                                //   <Text>{campaign.id}</Text>
                                                // </View>
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

export default ClosedPromotions;
