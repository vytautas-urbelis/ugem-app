import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withSpring } from "react-native-reanimated";
import { useEffect, useState } from "react";

import LOGO from "../../../../../assets/default-campaign.jpg";

import * as Haptics from "expo-haptics";

import { Feather, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { colors } from "../../../../../constants/colors";
import { BottomModal, SlideAnimation } from "react-native-modals";
// import EndCampaign from "../endCampaign";
import { authStorage } from "../../../../../MMKV/auth";

const ClosedCampaign = ({ campaign, onRefresh, index }) => {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0.2);
  const translateY = useSharedValue(600);

  //   const percents = parseFloat(campaign.value_counted / campaign.value_goal);
  const collectorType = campaign.collector_type.name;
  const cardTitle = collectorType + " collector card";

  const accessToken = authStorage.getString("accessToken");

  const [imageLoad, setImageLoad] = useState(true);
  const [isEndCampaign, setIsEndCampaign] = useState(false);

  const collectorLogo = campaign.logo ? { uri: campaign.logo } : LOGO;

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
      <Animated.View style={animatedStyle} className="flex-1 justify-center items-center flex mt-8">
        <View style={styles.shadow} className="w-full rounded-xl bg-shamrock-200 p-2  pb-8">
          <View className="flex-row justify-between">
            {/* <Text className=" w-[90%] text-shamrock-50 font-bold text-wrap text-xl">Campaign</Text> */}
            <TouchableOpacity
              onPress={() => {
                setIsEndCampaign(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              }}
              className="w-[10%] items-end justify-start">
              {/* <Feather name="x-square" size={28} color={colors["shamrock"]["500"]} /> */}
            </TouchableOpacity>
          </View>

          <View className="flex">
            {/* <View style={styles.shadow} className="w-[12%] mt-1">
              <Image
                onLoad={() => {
                  setImageLoad(true);
                }}
                source={collectorLogo}
                className=" h-12 w-12 rounded-2xl"></Image>
            </View> */}

            <Text className=" w-[86%] text-shamrock-700 font-bold text-wrap text-2xl">{campaign.name.toUpperCase()}</Text>
            <Text className=" w-[86%] text-shamrock-700  text-wrap text-xl">{campaign.description}</Text>
          </View>

          <View style={styles.shadowSmall} className="w-full rounded-xl bg-white mt-5 px-4 py-6">
            <View className=" flex-row">
              <View className=" h-12 w-12 rounded-lg bg-shamrock-100 items-center justify-center">
                <Ionicons name="people" size={22} color={"black"} />
              </View>
              <View className="ml-4">
                <Text className="text-md text-shamrock-400">Number of participants</Text>
                <Text className="text-xl font-bold text-shamrock-600">{campaign.participants}</Text>
              </View>
            </View>
            <View className="mt-5 flex-row">
              <View className=" h-12 w-12 rounded-lg bg-shamrock-100 items-center justify-center">
                {/* <Ionicons name="people" size={42} color={"black"} /> */}
                <Octicons name="number" size={22} color="black" />
              </View>
              <View className="ml-4">
                <Text className="text-md text-shamrock-400">
                  Total
                  {campaign.collector_type.id === 1 ? " stamps " : campaign.collector_type.id === 2 ? " points " : " "}
                  collected
                </Text>

                <Text className="text-xl font-bold text-shamrock-600">{campaign.value}</Text>
              </View>
            </View>
            <View className="mt-5 flex-row">
              <View className=" h-12 w-12 rounded-lg bg-shamrock-100 items-center justify-center">
                {/* <Ionicons name="people" size={42} color={"black"} /> */}
                <MaterialIcons name="card-giftcard" size={22} color="black" />
              </View>
              <View className="ml-4">
                <Text className="text-md text-shamrock-400">Total vouchers issued</Text>
                <Text className="text-xl font-bold text-shamrock-600">{campaign.vouchers_issued}</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
      {/* <BottomModal
        style={{ zIndex: 2 }}
        visible={isEndCampaign}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }>
        <EndCampaign setIsEndCampaign={setIsEndCampaign} campaign={campaign} onRefresh={onRefresh} />
      </BottomModal> */}
    </>
  );
};

export default ClosedCampaign;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 2,
  },
  shadowSmall: {
    shadowColor: colors.shamrock["700"],
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
