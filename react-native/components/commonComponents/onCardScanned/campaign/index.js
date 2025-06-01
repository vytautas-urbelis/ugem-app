import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Progress from "react-native-progress";
import {useEffect, useState} from "react";
import * as Haptics from "expo-haptics";
import {ValidateCardTeams} from "../../../../axios/axiosTeams/customerCard";
import {ValidateCard} from "../../../../axios/axiosBusiness/customerCard";
import {authStorage} from "../../../../MMKV/auth";
import {Entypo} from "@expo/vector-icons";
import {colors} from "../../../../constants/colors";
import {GetCustomersCollector} from "../../../../axios/axiosBusiness/customerCollector";

import UGEM from "../../../../assets/svg/uGem.svg";

import {returnStamp} from "../../../../utils/stamps";
import {getTeamProfileMMKV} from "../../../../MMKV/mmkvTeams";

const Campaign = ({isUserLogedInAsTeam, campaign, secretKey, setNumberOfCampiagns, numberOfCampaigns}) => {
    const campaign_type = campaign.collector_type.id; // Campaign type (1 = stamps, 2 = points, 3 = CHF)
    const [value, setValue] = useState(campaign_type === 1 ? 1 : 10); // Initial value depends on campaign type
    const [finished, setFinished] = useState(false); // Whether the process is finished
    const [isLoading, setIsLoading] = useState(false); // Loading state for async operations
    const [collector, setCollector] = useState(null); // Loading state for async operations
    const [percent, setPercent] = useState(false); // Loading state for async operations

    const accessToken = authStorage.getString("accessToken"); // Access token for API calls

    const maxValToAdd = collector ? collector.value_goal - collector.value_counted : campaign.value_goal;

    const teamsProfile = getTeamProfileMMKV();

    useEffect(() => {
        const per = collector ? (collector.value_counted + value) / campaign.value_goal : value / campaign.value_goal;
        // console.log(per)
        setPercent(per);
    }, [value]);

    useEffect(() => {
        const getCustomersSpecificCollector = async () => {
            try {
                // console.log(campaign.id, secretKey, accessToken)
                const collector = await GetCustomersCollector(campaign.id, secretKey, accessToken);
                setCollector(collector[0]);
                const per = collector[0] ? (collector[0].value_counted + value) / campaign.value_goal : value / campaign.value_goal;
                setPercent(per);
                // console.log(collector[0]);
            } catch (error) {
                console.log(error);
                const per = value / campaign.value_goal;
                setPercent(per);
            }
        };
        getCustomersSpecificCollector();
    }, []);

    const renderRoundObjects = () => {
        let roundObjects = [];
        if (!collector) {
            for (let i = 0; i < value; i++) {
                roundObjects.push(
                    <View
                        className=" h-[42] w-[42] bg-ship-gray-100 rounded-full m-3 ml-4 mr-4 items-center justify-center"
                        key={i}>
                        {/* <Entypo name="plus" size={32} color="white" /> */}
                        {/* <COFFEE width={60} height={70} fill={colors.zest["500"]} /> */}
                        {returnStamp(colors.zest["500"], campaign.stamp_design, 70)}
                    </View>,
                );
            }
            for (let i = 0; i < campaign.value_goal - value; i++) {
                roundObjects.push(
                    <View
                        className=" h-[42] w-[42] bg-ship-gray-100 rounded-full m-3 ml-4 mr-4 items-center justify-center"
                        key={i + 20}></View>,
                );
            }
        } else {
            for (let i = 0; i < collector.value_counted; i++) {
                roundObjects.push(
                    <View
                        className=" h-[42] w-[42] bg-ship-gray-100 rounded-full m-3 ml-4 mr-4 items-center justify-center"
                        key={i}>
                        {/* <Entypo name="check" size={24} color="white" /> */}
                        {/* <COFFEE width={60} height={70} fill={colors.shamrock["700"]} /> */}
                        {returnStamp(colors["ship-gray"]["900"], campaign.stamp_design, 70)}
                    </View>,
                );
            }
            for (let i = 0; i < value; i++) {
                roundObjects.push(
                    <View
                        className=" h-[42] w-[42] bg-ship-gray-100 rounded-full m-3 ml-4 mr-4 items-center justify-center"
                        key={i + 20}>
                        {/* <COFFEE width={60} height={70} fill={colors.zest["500"]} /> */}
                        {returnStamp(colors.zest["500"], campaign.stamp_design, 70)}
                    </View>,
                );
            }

            for (let i = 0; i < collector.value_goal - collector.value_counted - value; i++) {
                roundObjects.push(
                    <View
                        className=" h-[42] w-[42] bg-ship-gray-100 rounded-full m-3 ml-4 mr-4 items-center justify-center"
                        key={i + 100}></View>,
                );
            }
        }

        return roundObjects;
    };

    // Function to handle the API logic when the user clicks "Go"
    const onGo = async () => {
        setIsLoading(true);
        try {
            // If value is greater than 0, validate the card
            if (value !== 0) {
                if (isUserLogedInAsTeam) {
                    await ValidateCardTeams(campaign.id, value, secretKey, teamsProfile.user_id, accessToken);
                } else {
                    await ValidateCard(campaign.id, value, secretKey, accessToken);
                }
            }
            setNumberOfCampiagns(numberOfCampaigns - 1);
            // Notify success and mark the process as finished
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setFinished(true); // Mark the campaign as finished
        } catch (error) {
            // Handle errors and notify the user with haptic feedback and alert
            console.log(error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    // Rendering part of the component
    return (
        <>
            {!finished && (
                <View style={{height: Dimensions.get("window").height * 0.9}} className="bg-ship-gray-50">
                    <View className="w-full items-center ">
                        <View className="w-[80%]  mt-1">
                            <View
                                className={`items-center bg-white border border-ship-gray-200 rounded-lg w-full justify-between p-4`}>
                                <View
                                    className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[70] left-[-12] border-r border-ship-gray-200"></View>
                                <View
                                    className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[70] right-[-12] border-l border-ship-gray-200"></View>
                                <View className="w-full flex-row">
                                    <View className="w-18">
                                        {campaign.business_user_profile.logo ? (
                                            <Image source={{uri: `${campaign.business_user_profile.logo}`}}
                                                   className="w-14 h-14 rounded-md " alt="qr code"/>
                                        ) : (
                                            <View
                                                className="w-14 h-14 items-center justify-center bg-ship-gray-200 rounded-md">
                                                <Text className="text-3xl font-semibold text-ship-gray-700">
                                                    {campaign.business_user_profile.business_name.charAt(0).toUpperCase()}
                                                </Text>
                                            </View>
                                        )}
                                        {/* {campaign.business_user_profile.logo ? (
                            <Image
                              source={{ uri: `${MEDIA_URL}${campaign.business_user_profile.logo}` }}
                              className="w-20 h-20 rounded mb-4 "
                              alt="qr code"
                            />
                          ) : (
                            <Image
                              source={voucher.logo ? { uri: `${MEDIA_URL}${voucher.logo}` } : LOGO}
                              className=" w-20 h-20  rounded mb-4"
                              alt="Campaign Logo"
                            />
                          )} */}
                                    </View>

                                    <View className="flex-shrink">
                                        <Text className="ml-2 text-xl font-semibold text-ship-gray-900 text-start">
                                            {campaign.business_user_profile.business_name.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                                <View className="w-full items-center mt-6">
                                    <View className=" items-center rounded-md w-full flex">
                                        <View className="w-full items-center mt-4 mb-4">
                                            <Text
                                                className=" text-xl font-bold text-ship-gray-900 text-center">{campaign.name.toUpperCase()}</Text>
                                        </View>
                                    </View>
                                </View>
                                {campaign.collector_type.id === 1 ? (
                                    <>
                                        <View
                                            className=" flex-row w-[220] flex-wrap items-center justify-center">{renderRoundObjects()}</View>
                                        <View className=" items-center mt-4 flex">
                                            <Text
                                                className="text-center text-3xl font-semibold text-ship-gray-900 mt-1">{value}</Text>
                                        </View>

                                        <View className="flex-row w-full justify-center">
                                            {value === 1 ? (
                                                <View className="w-16 h-16 items-center justify-center">
                                                    <Entypo name="minus" size={42} color={colors["ship-gray"]["200"]}/>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setValue(value - 1);
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                                    }}
                                                    className="w-16 h-16 items-center justify-center">
                                                    <Entypo name="minus" size={42} color={colors["ship-gray"]["700"]}/>
                                                </TouchableOpacity>
                                            )}
                                            <View className="w-[20%]"></View>
                                            {value === maxValToAdd ? (
                                                <View className="w-16 h-16 items-center justify-center">
                                                    <Entypo name="plus" size={42} color={colors["ship-gray"]["200"]}/>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setValue(value + 1);
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                                    }}
                                                    className="w-16 h-16 items-center justify-center">
                                                    <Entypo name="plus" size={42} color={colors["ship-gray"]["700"]}/>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </>
                                ) : campaign.collector_type.id === 2 ? (
                                    <>
                                        <View className="w-full items-center flex mt-2">
                                            <View className="flex-row items-end">
                                                <Text className="text-center text-2xl font-semibold text-zest-400 mt-1">
                                                    {collector ? collector.value_counted + value : value}
                                                </Text>
                                                <Text
                                                    className="text-center text-lg font-semibold text-ship-gray-600 mt-1"> out
                                                    of </Text>
                                                <Text
                                                    className="text-center text-2xl font-semibold text-ship-gray-900 mt-1"> {campaign.value_goal}</Text>
                                                <Text
                                                    className="text-center text-lg font-semibold text-ship-gray-600 mt-1"> collected</Text>
                                            </View>
                                            {percent && (
                                                <View className="w-full items-center  mb-2 mt-6 px-3">
                                                    {/* <Progress.Bar
                            style={{ width: "100%" }}
                            progress={percent}
                            width={null}
                            height={30}
                            borderRadius={2}
                            color={colors.zest[200]}
                            unfilledColor={colors.shamrock[100]}
                            borderWidth={0}
                          /> */}
                                                    <Progress.Circle
                                                        size={120}
                                                        indeterminate={false}
                                                        progress={percent}
                                                        borderWidth={0}
                                                        unfilledColor={colors.shamrock["100"]}
                                                        color={colors.shamrock["400"]}
                                                        thickness={18}
                                                        showsText
                                                        textStyle={{color: colors.shamrock["600"], fontSize: 22}}
                                                    />
                                                </View>
                                            )}
                                        </View>

                                        <View className=" items-center mt-4 flex">
                                            <Text
                                                className="text-center text-3xl font-semibold text-ship-gray-900 mt-1">{value}</Text>
                                        </View>

                                        <View className="flex-row w-full justify-center">
                                            {value === 10 ? (
                                                <View className="w-16 h-16 items-center justify-center">
                                                    <Entypo name="minus" size={42} color={colors["ship-gray"]["200"]}/>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setValue(value - 10);
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                                    }}
                                                    className="w-16 h-16 items-center justify-center">
                                                    <Entypo name="minus" size={42} color={colors["ship-gray"]["700"]}/>
                                                </TouchableOpacity>
                                            )}
                                            <View className="w-[20%]"></View>
                                            {value === maxValToAdd ? (
                                                <View className="w-16 h-16 items-center justify-center">
                                                    <Entypo name="plus" size={42} color={colors["ship-gray"]["200"]}/>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setValue(value + 10);
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                                    }}
                                                    className="w-16 h-16 items-center justify-center">
                                                    <Entypo name="plus" size={42} color={colors["ship-gray"]["700"]}/>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </>
                                ) : (
                                    <></>
                                )}

                                {/* Go Button */}
                                <View className="items-center justify-center w-full">
                                    <TouchableOpacity
                                        className="w-full items-center justify-center m-3 p-4 borde bg-ship-gray-900 border-ship-gray-400 rounded-lg flex-row"
                                        onPress={onGo}>
                                        <Entypo name="plus" size={26} color={"white"}/>
                                        <Text
                                            className=" text-white font-semibold text-xl">{campaign.collector_type.id === 1 ? "Stamps" : "Points"}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="w-full items-end">
                                    <UGEM width={60} height={14} fill={colors.zest["400"]}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </>
    );
};

export default Campaign;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: colors.shamrock["700"],
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 2,
    },
    shadowGray: {
        shadowColor: colors["ship-gray"]["700"],
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 2,
    },

    photoHeight: {
        height: Dimensions.get("window").width * 0.45,
        width: Dimensions.get("window").width * 0.44,
    },
});
