import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useEffect, useState} from "react";

import * as Haptics from "expo-haptics";

// import CHECKED from "../../assets/pngs/checked.png";
import {Feather, Ionicons, MaterialIcons, Octicons, SimpleLineIcons} from "@expo/vector-icons";
import {colors} from "../../../../constants/colors";
import {BottomModal, SlideAnimation} from "react-native-modals";
import EndCampaign from "./endCampaign";
import {Pressable} from "react-native-gesture-handler";
import {saveCurrentCampaignMMKV} from "../../../../MMKV/mmkvCustomer/campaigns";
import {router} from "expo-router";

const CampaignInAccount = ({isUserLogedInAsTeam, campaign, onRefresh, index}) => {
    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(1);
    const translateX = useSharedValue(600);

    //   const percents = parseFloat(campaign.value_counted / campaign.value_goal);
    const collectorType = campaign.collector_type.name;

    // console.log();
    // console.log();
    // console.log(campaign.name);
    // console.log("Value  ", campaign.last_seven_days_value, campaign.one_week_ago_value, campaign.value);
    // console.log(
    //     "vouchers_issued  ",
    //     campaign.last_seven_days_vouchers_issued,
    //     campaign.one_week_ago_vouchers_issued,
    //     campaign.vouchers_issued,
    // );
    // console.log("participants  ", campaign.last_seven_days_participants, campaign.one_week_ago_participants, campaign.participants);

    const [imageLoad, setImageLoad] = useState(true);
    const [isEndCampaign, setIsEndCampaign] = useState(false);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        if (imageLoad) {
            scale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
            opacity.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
        }
    }, [imageLoad]);

    return (
        <>
            <Animated.View style={animatedStyle} className="flex-1 justify-center items-center flex mt-8">
                <View style={styles.shadow} className="w-full rounded-xl bg-shamrock-200 p-2  pb-2">
                    {/* <View style={styles.shadow} className="w-[12%] mt-1">
              <Image
                onLoad={() => {
                  setImageLoad(true);
                }}
                source={collectorLogo}
                className=" h-12 w-12 rounded-2xl"></Image>
            </View> */}
                    <View className="flex-row justify-between">
                        <View className="flex-row justify-between w-[90%]">
                            <View className=" w-[95%]">
                                <Text
                                    className="  text-shamrock-900 font-bold text-wrap text-lg">{campaign.name.toUpperCase()}</Text>
                                <Text
                                    className="  text-shamrock-700 font text-wrap text-base ">{campaign.description}</Text>
                            </View>
                        </View>

                        {!isUserLogedInAsTeam && (
                            <TouchableOpacity
                                onPress={() => {
                                    setIsEndCampaign(true);
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                                }}
                                className="w-[10%] items-end justify-start">
                                <Feather name="x-square" size={22} color={colors["shamrock"]["700"]}/>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.shadowSmall} className="w-full rounded-xl bg-white mt-2 px-2 py-3">
                        {/*<View style={styles.shadowSmall} className="w-full rounded-xl bg-white mt-5 px-4 py-6">*/}
                        <View className=" flex-row">
                            <View className=" h-12 w-12 rounded-lg bg-shamrock-100 items-center justify-center">
                                <Ionicons name="people" size={22} color={"black"}/>
                            </View>
                            <View className="ml-3">
                                <Text className="text-base text-shamrock-400">Participants</Text>
                                <Text className="text-lg font-bold text-shamrock-900">{campaign.participants}</Text>
                            </View>
                        </View>
                        <View className="mt-4 flex-row">
                            <View className=" h-12 w-12 rounded-lg bg-shamrock-100 items-center justify-center">
                                {/* <Ionicons name="people" size={42} color={"black"} /> */}
                                <Octicons name="number" size={22} color="black"/>
                            </View>
                            <View className="ml-3">
                                <Text className="text-base text-shamrock-400">
                                    Total
                                    {campaign.collector_type.id === 1 ? " stamps " : campaign.collector_type.id === 2 ? " points " : " "}
                                </Text>

                                <Text
                                    className="text-lg font-bold text-shamrock-900">{campaign.value ? campaign.value : 0}</Text>
                            </View>
                        </View>
                        <View className="mt-4 flex-row">
                            <View className=" h-12 w-12 rounded-lg bg-shamrock-100 items-center justify-center">
                                {/* <Ionicons name="people" size={42} color={"black"} /> */}
                                <MaterialIcons name="card-giftcard" size={22} color="black"/>
                            </View>
                            <View className="ml-3">
                                <Text className="text-base text-shamrock-400">Vouchers issued</Text>
                                <Text className="text-lg font-bold text-shamrock-900">{campaign.vouchers_issued}</Text>
                            </View>
                        </View>

                    </View>
                    <View className={"w-full items-end mt-2"}>
                        <Pressable onPress={() => {
                            saveCurrentCampaignMMKV(campaign);
                            router.push(`homeBusiness/campaign/${campaign.id}`);
                        }}>
                            <View className={"h-12 justify-center"}>
                                <SimpleLineIcons name="settings" size={24} color={colors["ship-gray"]["800"]}/>
                            </View>
                        </Pressable>
                    </View>

                </View>
            </Animated.View>
            <BottomModal
                style={{zIndex: 2}}
                visible={isEndCampaign}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <EndCampaign setIsEndCampaign={setIsEndCampaign} campaign={campaign} onRefresh={onRefresh}/>
            </BottomModal>
        </>
    );
};

export default CampaignInAccount;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "gray",
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 2,
    },
    shadowSmall: {
        shadowColor: colors.shamrock["700"],
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
        elevation: 2,
    },
    container: {
        flexDirection: "row", // Adjust this if you want a different layout
        flexWrap: "wrap", // Allows the items to wrap onto multiple lines
        margin: 10,
    },
    roundObject: {
        width: 20, // Adjust the size of the round objects
        height: 20,
        borderRadius: 10, // Half of width and height to make it round
        margin: 5, // Space between the round objects
    },
    dottedLine: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#dfdfdf",
        borderRadius: 1,
    },
});
