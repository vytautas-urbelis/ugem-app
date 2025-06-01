import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withSpring } from "react-native-reanimated";
import { useEffect, useState } from "react";

import LOGO from "../../../../../assets/default-promotion.jpg";

import * as Haptics from "expo-haptics";

import * as Progress from "react-native-progress";

import { Feather, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { colors } from "../../../../../constants/colors";
import { BottomModal, SlideAnimation } from "react-native-modals";
// import EndCampaign from "../endCampaign";
import { authStorage } from "../../../../../MMKV/auth";

const ClosedPromotion = ({ promotion, onRefresh, index }) => {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0.2);
  const translateY = useSharedValue(600);

  //   const percents = parseFloat(campaign.value_counted / campaign.value_goal);

  const [imageLoad, setImageLoad] = useState(true);

  const promotionLogo = promotion.image ? { uri: promotion.image } : LOGO;

  const percentsIssued = promotion.vouchers_issued ? parseFloat(promotion.vouchers_issued / promotion.vouchers_amount) : 0;

  const percentsUsed = promotion.vouchers_used ? parseFloat(promotion.vouchers_used / promotion.vouchers_issued) : 0;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      transform: [{ translateY: translateY.value }],
      // opacity: opacity.value,
    };
  });

  useEffect(() => {
    if (imageLoad) {
      setTimeout(() => {
        scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
        translateY.value = withSpring(0, { damping: 1500, stiffness: 100 });
        // opacity.value = withTiming(1, { duration: 2000, easing: Easing.out(Easing.exp) });
      }, index * 100);
    }
  }, [imageLoad]);

  return (
    <>
      <Animated.View style={animatedStyle} className="flex-1 justify-center items-center flex mt-2 mb-6">
        <View style={styles.shadow} className="w-full rounded-xl bg-portage-100 pb-8 p-2">
          <View className="flex-row justify-between">
            {/* <TouchableOpacity
              onPress={() => {
                setIsEndPromotion(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              }}
              className="w-[10%] items-end justify-start">
              <Feather name="x-square" size={28} color={colors["portage"]["400"]} />
            </TouchableOpacity> */}
          </View>

          <View className="flex">
            {/* <View style={styles.shadow} className="w-[12%] mt-1">
              <Image
                onLoad={() => {
                  setImageLoad(true);
                }}
                source={promotionLogo}
                className=" h-12 w-12 rounded-2xl"></Image>
            </View> */}

            <Text className=" w-[86%] text-portage-400 font-bold text-wrap text-2xl">{promotion.name.toUpperCase()}</Text>
            <Text className=" w-[86%] text-portage-400 text-wrap text-xl">{promotion.description}</Text>
          </View>

          <View style={styles.shadowSmall} className="w-full rounded-xl bg-white mt-5 px-4 py-6">
            <View className="mt-2 flex-row">
              <View className=" h-12 w-12 rounded-lg bg-portage-100 items-center justify-center">
                <MaterialIcons name="card-giftcard" size={22} color="black" />
              </View>
              <View className="ml-4">
                <Text className="text-md text-portage-400">Total vouchers issued</Text>
                <Text className="text-xl font-bold text-portage-300">{promotion.vouchers_issued}</Text>
              </View>
            </View>
            <View className=" w-full">
              <Text className="text-lg text-portage-900 mt-2">
                {promotion.vouchers_issued} out of {promotion.vouchers_amount} vouchers already issued.{" "}
              </Text>
              <View className="w-full items-center mt-1  mb-2">
                <Progress.Bar
                  style={{ width: "100%" }}
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
                  <Text className="text-lg text-portage-900  mt-2">
                    {promotion.vouchers_used} out of {promotion.vouchers_issued} vouchers already used.{" "}
                  </Text>
                  <View className="w-full items-center mt-1  mb-2">
                    <Progress.Bar
                      style={{ width: "100%" }}
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
      </Animated.View>
      {/* <BottomModal
        style={{ zIndex: 2 }}
        visible={isEndPromotion}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }>
        <EndPromotion setIsEndPromotion={setIsEndPromotion} promotion={promotion} onRefresh={onRefresh} />
      </BottomModal> */}
    </>
  );
};

export default ClosedPromotion;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 2,
  },
  shadowSmall: {
    shadowColor: colors.portage["400"],
    shadowOffset: { width: 0, height: 3 },
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
