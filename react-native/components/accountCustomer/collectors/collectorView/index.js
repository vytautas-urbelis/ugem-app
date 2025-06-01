import {Image, ImageBackground, StyleSheet, Text, View} from "react-native";
import {MEDIA_URL} from "../../../../utils/CONST";
import * as Progress from "react-native-progress";

import Animated, {cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useEffect, useState} from "react";
import {getCustomerMMKV} from "../../../../MMKV/mmkvCustomer/user";

import {authStorage} from "../../../../MMKV/auth";

import UGEM from "../../../../assets/svg/uGem.svg";
import {colors} from "../../../../constants/colors";
import {Feather} from "@expo/vector-icons";

import PAPER from "../../../../assets/paper.png";
import {router} from "expo-router";
import {GetCollectorLogs} from "../../../../axios/axiosCustomer/collector";
import Stamp from "./stamp";
import {Pressable, ScrollView, TouchableOpacity} from "react-native-gesture-handler";

const CollectorView = ({collector}) => {
    customerUser = getCustomerMMKV() ? getCustomerMMKV() : null;
    accessToken = authStorage.getString("accessToken");

    const [percent, setPercent] = useState(1); // Loading state for async operations
    const [imageLoaded, setImageLoaded] = useState(false);
    const [stampsLoaded, setStampsLoaded] = useState(false);
    const [stamps, setStamps] = useState([]);

    // const percent = parseFloat(collector.value_counted / collector.value_goal);
    const collectorType = collector.campaign.collector_type;


    const opacity = useSharedValue(0);

    const businesId = collector.business_user_profile.user_id;

    useEffect(() => {

        const fetchAndProcessLogs = async () => {
            try {
                const logs = await GetCollectorLogs(accessToken, collector.id);

                const roundObjects = createRoundObjectsFromLogs(logs, collector);

                setStamps(roundObjects);
                setStampsLoaded(true);
            } catch (error) {
                console.error("Error fetching or processing logs:", error);
            }
        };

        if (collectorType === 1) {
            fetchAndProcessLogs();
        } else {
            setStampsLoaded(true);
        }

    }, [collector]);


// Helper function to create round objects from logs
    const createRoundObjectsFromLogs = (logs, collector) => {
        const roundObjects = [];

        // Generate round objects for logs with value_added
        logs.forEach(log => {
            for (let i = 0; i < log.value_added; i++) {
                roundObjects.push(
                    <Stamp collector={collector} log={log} i={i}/>
                );
            }
        });

        // Fill remaining round objects to match the value_goal
        for (let i = roundObjects.length; i < collector.value_goal; i++) {
            roundObjects.push(
                <View
                    className="h-[60] w-[60] rounded-full m-3 ml-3 mr-3 items-center justify-center"
                    key={`empty-${i}`}
                    style={{backgroundColor: colors["ship-gray"]["100"]}}
                >
                    {/* Placeholder for empty stamp */}
                </View>
            );
        }

        return roundObjects;
    };

    // useEffect(() => {
    //
    //     const getLogs = async () => {
    //         try {
    //             const logs = await GetCollectorLogs(accessToken, collector.id)
    //             console.log('LOGS', logs)
    //
    //             let roundObjects = [];
    //             for (const log of logs) {
    //                 for (let i = 0; i < log.value_added; i++) {
    //                     roundObjects.push(
    //                         <View
    //                             className=" h-[55] w-[55] rounded-full m-4 ml-4 mr-4 items-center justify-center"
    //                             key={log.id + i}
    //                             style={{backgroundColor: colors["ship-gray"]["100"]}}>
    //                             <Pressable onPress={() => {
    //                                 console.log(log.date_created)
    //                             }}>
    //                                 {returnStamp("#6870ec", collector.campaign.stamp_design, 90)}
    //                             </Pressable>
    //
    //                         </View>
    //                     )
    //                 }
    //             }
    //             for (let i = roundObjects.length; i < collector.value_goal; i++) {
    //                 roundObjects.push(
    //                     <View
    //                         className=" h-[55] w-[55] rounded-full m-2 ml-4 mr-4 items-center justify-center"
    //                         key={i + 100}
    //                         style={{backgroundColor: colors["ship-gray"]["100"]}}>
    //                         {/* <Image source={CHECKED} className="w-[36] h-[30] opacity-10"></Image> */}
    //                     </View>
    //                 )
    //             }
    //             console.log("roundObjects", roundObjects);
    //             setStamps(roundObjects);
    //             setStampsLoaded(true);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }
    //
    //     getLogs();
    // }, [collector]);


    useEffect(() => {
        const per = collector.value_counted / collector.value_goal;
        setPercent(per);
    }, []);


    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });


    useEffect(() => {
        if (imageLoaded && stampsLoaded) {
            opacity.value = withTiming(1, {duration: 250, easing: Easing.out(Easing.exp)});
        }
        return () => {
            cancelAnimation(opacity)
        };
    }, [imageLoaded, stampsLoaded]);

    // const renderRoundObjects = () => {
    //     let roundObjects = [];
    //     for (let i = 0; i < collector.value_goal; i++) {
    //         roundObjects.push(
    //             <View key={i}>
    //                 {i < collector.value_counted ? (
    //                     <View
    //                         className=" h-[55] w-[55] rounded-full m-4 ml-4 mr-4 items-center justify-center"
    //                         key={i}
    //                         style={{backgroundColor: colors["ship-gray"]["100"]}}>
    //                         {/* <Image source={CHECKED} className="w-[36] h-[30]"></Image> */}
    //                         {returnStamp("#6870ec", collector.campaign.stamp_design, 90)}
    //                         {/* {returnStamp(colors.shamrock["700"], collector.campaign.stamp_design, 90)} */}
    //                     </View>
    //                 ) : (
    //                     <View
    //                         className=" h-[55] w-[55] rounded-full m-2 ml-4 mr-4 items-center justify-center"
    //                         key={i + 100}
    //                         style={{backgroundColor: colors["ship-gray"]["100"]}}>
    //                         {/* <Image source={CHECKED} className="w-[36] h-[30] opacity-10"></Image> */}
    //                     </View>
    //                 )}
    //             </View>,
    //         );
    //     }
    //     return roundObjects;
    // };

    return (
        <Animated.View style={animatedStyle}>
            <View className="w-full h-28 bg-white justify-center items-center border-b border-b-ship-gray-100">

                <View className="w-16 h-16 items-start justify-center absolute top-12 left-4">
                    <Pressable
                        onPress={() => {
                            router.back()
                        }}>
                        <Feather name="chevron-left" size={24} color={colors["ship-gray"]["800"]}/>
                    </Pressable>
                </View>

                <View className="mt-10">
                    <Text className="text-3xl font-bold text-normaltext">Collector</Text>
                </View>
            </View>
            <ScrollView className="w-screen p-5 bg-ship-gray-50">
                {/*<TouchableOpacity activeOpacity={0.99}>*/}
                <View className="">
                    <View className="bg-ship-gray-50 justify-between ">
                        <View className="w-full items-center ">
                            <View className="w-full  mt-1 max-w-[360]">
                                <View
                                    className={`  items-center bg-white border border-ship-gray-200 rounded-lg w-full justify-between`}>
                                    {/* <View className="w-full"> */}
                                    {/*<LinearGradient*/}
                                    {/*  colors={colColors}*/}
                                    {/*  start={{ x: 0, y: 0 }}*/}
                                    {/*  end={{ x: 1, y: 1 }}*/}
                                    {/*  locations={[0.33, 0.6, 0.7]}*/}
                                    {/*  style={{ width: "100%", justifyContent: "center", borderTopLeftRadius: 7, borderBottomLeftRadius: 7 }}>*/}
                                    <ImageBackground
                                        className=" w-full rounded-lg"
                                        source={PAPER}
                                        resizeMode="cover"
                                        onLoadEnd={() => setImageLoaded(true)}
                                        imageStyle={{opacity: 0.2}}>

                                        <TouchableOpacity
                                            onPress={() => {
                                                router.push({
                                                    pathname: `/homeCustomer/businessProfile/${businesId}`,
                                                    params: {businessID: businesId}
                                                })
                                            }}
                                        >
                                            <View className="w-full flex-row p-4 rounded-lg">
                                                <View className="w-18">
                                                    {collector.business_user_profile.logo ? (
                                                        <Image
                                                            source={{uri: `${MEDIA_URL}${collector.business_user_profile.logo}`}}
                                                            className="w-16 h-16 rounded-md "
                                                            alt="qr code"
                                                        />
                                                    ) : (
                                                        <View
                                                            className="w-16 h-16 items-center justify-center bg-ship-gray-100 rounded-md">
                                                            <Text className="text-4xl font-semibold text-ship-gray-700">
                                                                {collector.business_user_profile.business_name.charAt(0).toUpperCase()}
                                                            </Text>
                                                        </View>
                                                    )}

                                                </View>

                                                <View className="flex-shrink">
                                                    <Text
                                                        className="ml-2 text-xl text-ship-gray-900 font-semibold text-start">
                                                        {collector.business_user_profile.business_name}
                                                    </Text>
                                                    <Text
                                                        className="ml-2 text-base text-ship-gray-700 text-start">{collector.date_created.split("T")[0]}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                    </ImageBackground>

                                    <View
                                        className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[75] left-[-12] border-r border-ship-gray-200"></View>
                                    <View
                                        className="w-6 h-5 bg-ship-gray-50 rounded-full absolute top-[75] right-[-12] border-l border-ship-gray-200"></View>
                                    <View className="w-full items-center p-4">
                                        <View className="w-full items-center mt-2">
                                            <View className=" items-center rounded-md w-full flex">
                                                <View className="w-full items-center mt-2 mb-3">
                                                    <Text
                                                        className=" text-2xl font-bold text-ship-gray-700 text-center">
                                                        {collector.campaign.name.toUpperCase()}
                                                    </Text>
                                                </View>
                                                <View className="w-full items-center mt-2 mb-3">
                                                    <Text
                                                        className="ml-2 text-lg  text-ship-gray-900 text-center">{collector.campaign.description}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {collectorType === 1 ? (
                                            <>
                                                <View
                                                    // className=" flex-row w-[280] flex-wrap items-center justify-center">{renderRoundObjects()}</View>
                                                    className=" flex-row w-[280] flex-wrap items-center justify-center">{stamps}</View>
                                                <View className="mt-6 w-[80%] pl-6 pr-6">
                                                    <Text className="text-center text-base font-light">
                                                        You need another{" "}
                                                        <Text
                                                            className="text-center text-base font-light text-zest-500">
                                                            {collector.value_goal - collector.value_counted}
                                                        </Text>{" "}
                                                        stamps to redeem the voucher.
                                                    </Text>
                                                </View>

                                            </>
                                        ) : collectorType === 2 ? (
                                            <>
                                                <View className="w-full items-center flex mt-2">
                                                    <View className="flex-row items-end">
                                                        <Text
                                                            className="text-center text-2xl font-semibold text-zest-400 mt-1">{collector.value_counted}</Text>
                                                        <Text
                                                            className="text-center text-lg font-semibold text-ship-gray-600 mt-1"> out
                                                            of </Text>
                                                        <Text
                                                            className="text-center text-2xl font-semibold text-moody-blue-600 mt-1"> {collector.value_goal}</Text>
                                                        <Text
                                                            className="text-center text-lg font-semibold text-ship-gray-600 mt-1"> collected</Text>
                                                    </View>
                                                    {percent && (
                                                        <View className="w-full items-center  mb-2 mt-6 px-3">
                                                            <Progress.Circle
                                                                size={190}
                                                                indeterminate={false}
                                                                progress={percent}
                                                                borderWidth={0}
                                                                unfilledColor={colors["moody-blue"]["200"]}
                                                                color={colors["moody-blue"]["500"]}
                                                                thickness={28}
                                                                showsText
                                                                textStyle={{
                                                                    color: colors["moody-blue"]["500"],
                                                                    fontSize: 32,
                                                                    fontWeight: 700
                                                                }}
                                                            />
                                                            <View className="mt-3 mb-3  w-[80%] pl-6 pr-6">
                                                                <Text className="text-center text-base font-light">
                                                                    You need another{" "}
                                                                    <Text
                                                                        className="text-center text-base font-light text-zest-500">
                                                                        {collector.value_goal - collector.value_counted}
                                                                    </Text>{" "}
                                                                    points to redeem the voucher.
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                </View>
                                            </>
                                        ) : (
                                            <></>
                                        )}

                                        <View className="w-full items-end justify-between mt-10 mb-1 flex-row">
                                            <Text className="ml-2 text-sm text-ship-gray-500 text-start">
                                                Campaign ends {collector.campaign.ending_date.split("T")[0]}
                                            </Text>
                                            <UGEM width={60} height={14} fill={colors.zest["400"]}/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                {/*</TouchableOpacity>*/}
                <View className={'h-40'}></View>
            </ScrollView>

        </Animated.View>
    );
};

export default CollectorView;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 7.84,
        elevation: 10,
    },
});
