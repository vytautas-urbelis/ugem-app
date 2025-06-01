import {Text, View} from "react-native";

import {useEffect, useState} from "react";
import Animated, {cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {authStorage} from "../../../../MMKV/auth";
import {AntDesign} from "@expo/vector-icons";
import {colors} from "../../../../constants/colors";
import {LikeWallMessage} from "../../../../axios/axiosCustomer/business";
import * as Haptics from "expo-haptics"; // Import Haptics for feedback
import PostHeader from "../postHeader";
import {Pressable} from "react-native-gesture-handler";

const FeedMessage = ({openBusinessProfile, item, index, currentLocation, toggleFollow}) => {
    const [wallMessage, setWallMessage] = useState(null);

    useEffect(() => {
        setWallMessage(item.data);
    }, [item]);

    const accessToken = authStorage.getString("accessToken");

    const toggleLikeMessage = async () => {
        try {
            const updatedWallMessage = {...wallMessage};
            updatedWallMessage["liked"] = !updatedWallMessage.liked;
            if (updatedWallMessage["liked"]) {
                updatedWallMessage["likes_number"] += 1
            } else {
                updatedWallMessage["likes_number"] -= 1
            }
            setWallMessage(updatedWallMessage);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            const res = await LikeWallMessage(item.data.id, accessToken);
            updatedWallMessage["likes_number"] = res.likes_number;
            updatedWallMessage["liked"] = res.liked;
            setWallMessage(updatedWallMessage);
        } catch (error) {
            console.log(error);
        } finally {
        }
    };

    // Animation configurations for image scaling and opacity
    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        setTimeout(() => {
            scale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
            opacity.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
        }, index * 100);
        return () => {
            cancelAnimation(scale);
            cancelAnimation(opacity)
        };
    }, []);

    return (
        <Animated.View style={animatedStyle} className="w-full mb-8 border-b pb-4 border-ship-gray-100">
            {wallMessage && (
                <>
                    <View className="flex-row gap-2 items-start mb-2">
                        <PostHeader
                            businessProfile={item.data.business_user_profile}
                            distance={item.distance}
                            openBusinessProfile={openBusinessProfile}
                            currentLocation={currentLocation}
                            toggleFollow={toggleFollow}
                        />
                    </View>
                    <View className="flex">
                        {/*<View className="w-12"></View>*/}
                        <View className="justify-center items-center flex-shrink">
                            <View className="rounded-lg flex flex-row bg-ship-gray-50 p-2">
                                <View className="w-full p-1">
                                    <View className="w-full justify-between flex-row">
                                        {/* Delete message */}
                                        {/* <Text className="text-xs text-gray-500">delete</Text> */}
                                    </View>

                                    {/* Message content */}
                                    <Text className=" text-base text-ship-gray-900">{wallMessage.message}</Text>
                                </View>
                            </View>
                            <View className="w-full justify-between items-end flex-row mt-2">
                                {/* Message date */}
                                <Text
                                    className="text-sm text-ship-gray-400">{item.data.date_created.split("T")[0]}</Text>
                                {/* Message likes */}
                                <Pressable onPress={toggleLikeMessage}
                                           className="flex-row mt-1 w-14 items-start justify-end">
                                    {/* <HEART width={14} height={14} fill={"#A0A0A0"} /> */}
                                    <View className="flex-row mt-1 w-14  h-8 items-start justify-end">
                                        <Text
                                            className="mr-1 text-sm text-ship-gray-400">{wallMessage.likes_number}</Text>
                                        {wallMessage.liked ? (
                                            <View>
                                                <AntDesign name="heart" size={16} color="red"/>
                                            </View>
                                        ) : (
                                            <View>
                                                <AntDesign name="hearto" size={16} color={colors["ship-gray"]["800"]}/>
                                            </View>
                                        )}
                                    </View>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </>
            )}
        </Animated.View>
    );
};

export default FeedMessage;
