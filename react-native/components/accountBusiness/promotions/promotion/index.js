import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import Animated, {useSharedValue, useAnimatedStyle, withTiming, Easing, withSpring} from "react-native-reanimated";
import {useEffect, useState} from "react";
import * as Progress from "react-native-progress";

import {colors} from "../../../../constants/colors";

import LOGO from "../../../../assets/default-campaign.jpg";
// import CHECKED from "../../assets/pngs/checked.png";

import {Feather, Ionicons, MaterialIcons, Octicons} from "@expo/vector-icons";
import {BottomModal, SlideAnimation} from "react-native-modals";
import EndPromotion from "./endPromotion";

import * as Haptics from "expo-haptics";

const PromotionInAccount = ({promotion, onRefresh, index}) => {
    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(1);
    const translateX = useSharedValue(600);

    const screenWidth = Dimensions.get("window").width * 0.8;

    const percentsIssued = promotion.vouchers_issued ? parseFloat(promotion.vouchers_issued / promotion.vouchers_amount) : 0;

    const percentsUsed = promotion.vouchers_used ? parseFloat(promotion.vouchers_used / promotion.vouchers_issued) : 0;
    // const collectorType = campaign.collector_type.name;
    // const cardTitle = collectorType + " collector card";

    const [imageLoad, setImageLoad] = useState(true);
    const [isEndPromotion, setIsEndPromotion] = useState(false);

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

    // const animatedStyle = useAnimatedStyle(() => {
    //   return {
    //     transform: [{ scale: scale.value }],
    //     transform: [{ translateX: translateX.value }],
    //     // opacity: opacity.value,
    //   };
    // });

    // useEffect(() => {
    //   if (imageLoad) {
    //     setTimeout(() => {
    //       translateX.value = withSpring(0, { damping: 1500, stiffness: 300 });
    //       scale.value = withTiming(1, { duration: 2000, easing: Easing.out(Easing.exp) });
    //       // opacity.value = withTiming(1, { duration: 2000, easing: Easing.out(Easing.exp) });
    //     }, index * 100);
    //   }
    // }, [imageLoad]);

    return (
        <>
            <Animated.View style={animatedStyle} className="flex-1 justify-center items-center flex mt-2 mb-4">
                <View style={styles.shadow} className="w-full rounded-xl bg-portage-200 pb-8 p-2">
                    <View className="flex-row justify-between">
                        {/* <Text className=" w-[90%] text-portage-50 font-bold text-wrap text-xl">Promotion</Text> */}
                        <View className="flex-row justify-between w-[90%]">
                            {/* <View style={styles.shadow} className="w-[18%] mt-1">
              <Image
                onLoad={() => {
                  setImageLoad(true);
                }}
                source={promotionLogo}
                className=" h-16 w-16 rounded-2xl"></Image>
            </View> */}

                            <View className="w-[95%]">
                                {/* <Text className="  text-ship-gray-400 text-wrap text-xl">Promotion</Text> */}
                                <Text
                                    className="  text-portage-900 font-bold text-wrap text-lg">{promotion.name.toUpperCase()}</Text>
                                <Text
                                    className="  text-portage-900 text-wrap text-base">{promotion.description}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setIsEndPromotion(true);
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                            }}
                            className="w-[10%] items-end justify-start">
                            <Feather name="x-square" size={22} color={colors["portage"]["700"]}/>
                        </TouchableOpacity>
                    </View>

                    {/* <Text className=" w-10/12 text-portage-50 font-bold text-wrap text-xl">Promotion</Text>
          <View className="flex-row justify-between">
            <Text className=" w-10/12 text-portage-950 text-wrap font-bold text-3xl">{promotion.name}</Text>
            <TouchableOpacity className="w-2/12 items-end justify-start">
              <Feather name="x-square" size={36} color="black" />
            </TouchableOpacity>
          </View> */}

                    <View style={styles.shadowSmall} className="w-full rounded-xl bg-white mt-2 px-2 py-3">
                        {/*<View style={styles.shadowSmall} className="w-full rounded-xl bg-white mt-5 px-4 py-6">*/}
                        {/* <View className=" flex-row">
              <View className=" h-16 w-16 rounded-lg bg-portage-100 items-center justify-center">
                <Ionicons name="people" size={36} color={"black"} />
              </View>
              <View className="ml-4">
                <Text className="text-lg text-portage-400">Number of participants</Text>
                <Text className="text-4xl font-bold text-portage-900">{campaign.participants}</Text>
              </View>
            </View> */}
                        {/* <View className="mt-10 flex-row">
              <View className=" h-20 w-20 rounded-xl bg-sundown-100 items-center justify-center">
                <Octicons name="number" size={42} color="black" />
              </View>
              <View className="ml-4">
              </View>
            </View> */}
                        <View className=" flex-row">
                            <View className=" h-12 w-12 rounded-lg bg-portage-100 items-center justify-center">
                                <MaterialIcons name="card-giftcard" size={22} color="black"/>
                            </View>
                            <View className="ml-4">
                                <Text className="text-base text-portage-400">Total vouchers issued</Text>
                                <Text className="text-lg font-bold text-portage-900">{promotion.vouchers_issued}</Text>
                            </View>
                        </View>

                        <View className=" w-full">
                            <Text className="text-base text-portage-900 mt-2">
                                {promotion.vouchers_issued} out of {promotion.vouchers_amount} vouchers already
                                issued.{" "}
                            </Text>
                            <View className="w-full items-center mt-1  mb-2">
                                <Progress.Bar
                                    style={{width: "100%"}}
                                    progress={percentsIssued}
                                    width={null}
                                    height={10}
                                    borderRadius={2}
                                    color={colors.portage[500]}
                                    unfilledColor={colors.portage[200]}
                                    borderWidth={0}
                                />
                            </View>
                            {promotion.vouchers_issued ? (
                                <>
                                    <Text className="text-base text-portage-900  mt-2">
                                        {promotion.vouchers_used} out of {promotion.vouchers_issued} vouchers already
                                        used.{" "}
                                    </Text>
                                    <View className="w-full items-center mt-1  mb-2">
                                        <Progress.Bar
                                            style={{width: "100%"}}
                                            progress={percentsUsed}
                                            width={null}
                                            height={10}
                                            borderRadius={2}
                                            color={colors.portage[500]}
                                            unfilledColor={colors.portage[200]}
                                            borderWidth={0}
                                        />
                                    </View>
                                </>
                            ) : (
                                <></>
                            )}
                        </View>
                    </View>
                </View>
                {/* <View className="w-full justify-center items-center  mb-3 mt-1 ">
          <View style={styles.shadow} className="w-full flex items-center  rounded-md bg-tablebackground">
            <View className="w-5 h-5 bg-background rounded-full absolute top-[-10] left-[-10]"></View>
            <View className="w-5 h-5 bg-background rounded-full absolute top-[-10] right-[-10]"></View>
            <View className="flex-row justify-between">
              <View className="w-4/12 items-center justify-start pt-3 pb-3">
                <Image
                  onLoad={() => {
                    setImageLoad(true);
                  }}
                  source={collectorLogo}
                  className=" h-24 w-24 rounded-md"></Image>
              </View>
              <View className="w-8/12 justify-between pt-3">
                <View>
                  <Text className="text-xl font-semibold text-normaltext">{promotion.name}</Text>
                </View>
                <View className="w-full flex flex-row justify-between mt-2">
                  <View>
                    <Text className="text-base text-secondtext text-left pt-1">Started:</Text>
                    <Text className="text-lg text-left text-lime-700">{promotion.date_created}</Text>
                  </View>
                  <View className="pr-4">
                    <View className="flex flex-row jus">
                      <Text className="text-base text-secondtext text-left pt-1 pl-3">Ends:</Text>
                    </View>
                    <View>
                      <Text className="text-lg text-left h-10 text-red-700 pl-3">
                        {promotion.date_ends ? promotion.date_ends : <Text>Permanent</Text>}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="w-full">
              <View className="w-full" style={styles.dottedLine}>
                <View className="w-4 h-4 bg-background rounded-full absolute top-[-8] left-[-8]"></View>
                <View className="w-4 h-4 bg-background rounded-full absolute top-[-8] right-[-8]"></View>
              </View>

              <View className=" w-full mb-3">
                <Text className="text-base text-normaltext ml-4 mt-2">
                  {promotion.vouchers_issued} out of {promotion.vouchers_amount} vouchers already issued.{" "}
                </Text>
                <View className="w-full items-center mt-1 pl-4 pr-4 mb-2">
                  <Progress.Bar
                    style={{ width: "100%" }}
                    progress={percentsIssued}
                    width={null}
                    height={10}
                    borderRadius={2}
                    color="#fc9404"
                    unfilledColor="#fff1c5"
                    borderWidth={0}
                  />
                </View>
                {promotion.vouchers_issued ? (
                  <>
                    <Text className="text-xs text-normaltext ml-4 mt-2">
                      {promotion.vouchers_used} out of {promotion.vouchers_issued} vouchers already used.{" "}
                    </Text>
                    <View className="w-full items-center mt-1 pl-4 pr-4 mb-2">
                      <Progress.Bar
                        style={{ width: "100%" }}
                        progress={percentsUsed}
                        width={null}
                        height={10}
                        borderRadius={2}
                        color="#fc9404"
                        unfilledColor="#fff1c5"
                        borderWidth={0}
                      />
                    </View>
                  </>
                ) : (
                  <></>
                )}
              </View>
            </View>
          </View>
        </View> */}
            </Animated.View>
            <BottomModal
                style={{zIndex: 2}}
                visible={isEndPromotion}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <EndPromotion setIsEndPromotion={setIsEndPromotion} promotion={promotion} onRefresh={onRefresh}/>
            </BottomModal>
        </>
    );
};

export default PromotionInAccount;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "gray",
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 2,
    },
    shadowSmall: {
        shadowColor: colors.portage["700"],
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
        elevation: 2,
    },
    screenWidth: {
        width: Dimensions.get("window").width * 0.96,
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
