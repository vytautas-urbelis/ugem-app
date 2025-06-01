import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

import { useEffect, useState } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { authStorage } from "../../../../MMKV/auth";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../constants/colors";
import { LikeWallMessage } from "../../../../axios/axiosCustomer/business";
import { getCustomerMMKV } from "../../../../MMKV/mmkvCustomer/user";
import * as Haptics from "expo-haptics"; // Import Haptics for feedback

const WallMessageInBusinessProfile = ({ message, businessProfile, index }) => {
  const [wallMessage, setWallMessage] = useState(null);

  const accessToken = authStorage.getString("accessToken");

  // const accessToken = authStorage.getString("accessToken");
  const customerProfile = getCustomerMMKV();

  useEffect(() => {
    setWallMessage(message);
  }, [message]);

  const toggleLikeMessage = async () => {
    try {
      const updatedWallMessage = { ...wallMessage };
      updatedWallMessage["liked"] = !updatedWallMessage.liked;
      setWallMessage(updatedWallMessage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const res = await LikeWallMessage(message.id, accessToken);
      setWallMessage(res);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // // Animation configurations for image scaling and opacity
  // const scale = useSharedValue(0.95);
  // const translateY = useSharedValue(800);

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ scale: scale.value }],
  //     transform: [{ translateY: translateY.value }],
  //   };
  // });

  // // Trigger animation when image is loaded
  // useEffect(() => {
  //   // Delay the animation of each item based on its index
  //   setTimeout(() => {
  //     scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
  //     translateY.value = withSpring(0, { damping: 1500, stiffness: 100 });
  //   }, index * 100);
  // }, []);

  // Animation configurations for image scaling and opacity
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    setTimeout(() => {
      scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
      opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
    }, index * 100);
  }, []);

  return (
    <>
      {wallMessage && (
        <Animated.View style={animatedStyle} className="justify-center items-center flex">
          <View className=" mt-4 rounded-lg flex flex-row p-2 bg-ship-gray-50">
            <View className="w-full p-1">
              <View className="w-full justify-between flex-row">
                {/* Business name */}
                <Text className="text-base text-ship-gray-400">{businessProfile.business_name}</Text>
                {/* Delete message */}
                {/* <Text className="text-xs text-gray-500">delete</Text> */}
              </View>

              {/* Message content */}
              <Text className="mb-2 text-lg text-ship-gray-900">{wallMessage.message}</Text>

              <View className="w-full justify-between items-end flex-row mt-1">
                {/* Message date */}
                <Text className="text-sm text-ship-gray-400">
                  {wallMessage.date_created.split("T")[0]} {/* Display only the date part */}
                </Text>
                {/* Message likes */}
                <TouchableOpacity onPress={toggleLikeMessage} className="flex-row">
                  {/* <HEART width={14} height={14} fill={"#A0A0A0"} /> */}
                  <Text className="mr-2 text-base text-ship-gray-400">{wallMessage.likes_number}</Text>
                  {wallMessage.liked ? (
                    <View>
                      <AntDesign name="heart" size={18} color="red" />
                    </View>
                  ) : (
                    <View>
                      <AntDesign name="hearto" size={18} color={colors["ship-gray"]["800"]} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default WallMessageInBusinessProfile;

// Styles
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,
    elevation: 2,
  },
  photoHeight: {
    height: Dimensions.get("window").width * 0.45,
  },
});
