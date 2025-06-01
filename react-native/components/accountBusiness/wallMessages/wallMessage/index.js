import {View, Text, StyleSheet, Dimensions} from "react-native";

import DELETE from "../../../../assets/svg/delete.svg";
import HEART from "../../../../assets/svg/heart.svg";
import {TouchableOpacity} from "react-native";
import {useEffect, useState} from "react";
import {BottomModal, SlideAnimation} from "react-native-modals";
import ConfirmDeleteMessage from "../confirmDeleteMessage";

import * as Haptics from "expo-haptics";
import {DeleteMessage, GetWallMessages} from "../../../../axios/axiosBusiness/wallMessage";
import {saveWallMessages} from "../../../../MMKV/mmkvBusiness/wallMessages";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {authStorage} from "../../../../MMKV/auth";
import {AntDesign, MaterialCommunityIcons} from "@expo/vector-icons";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../../MMKV/control";

const WallMessage = ({message, index}) => {
    // Component to display a single wall message with business name, message content, and date

    const [isDeleteMessage, setIsDeleteMessage] = useState(false);

    const [refreshBusinessFeed, setRefreshBusinessFeed] = useMMKVBoolean("refreshBusinessFeed", controlStorage);

    const accessToken = authStorage.getString("accessToken");

    // Animation configurations for image scaling and opacity
    // const scale = useSharedValue(0.95);
    // const opacity = useSharedValue(1);
    const translateX = useSharedValue(100);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            // transform: [{scale: scale.value}],
            transform: [{translateX: translateX.value}],
        };
    });

    // Trigger animation when image is loaded
    useEffect(() => {
        // Delay the animation of each item based on its index
        setTimeout(() => {
            // scale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
            translateX.value = withSpring(0, {damping: 1500, stiffness: 100});
        }, index * 100);
    }, []);

    const deleteMessage = async () => {
        try {
            // console.log(accessToken)
            const res = await DeleteMessage(accessToken, message.id);
            const messages = await GetWallMessages(accessToken); // Fetch updated messages
            saveWallMessages(messages); // Save messages locally
            // onRefresh();
            setRefreshBusinessFeed(!refreshBusinessFeed);
            // router.navigate("/home/account"); // Redirect to home screen
            setIsDeleteMessage(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Animated.View style={animatedStyle} className="justify-center items-center flex ">
            <View key={message.id}
                  className="bg-ship-gray-50 mb-3 mt-2 rounded-xl flex flex-row p-3 border border-ship-gray-100">
                <View className="w-full p-1">
                    <BottomModal
                        style={{zIndex: 2}}
                        visible={isDeleteMessage}
                        modalAnimation={
                            new SlideAnimation({
                                slideFrom: "bottom",
                            })
                        }>
                        <ConfirmDeleteMessage setIsDeleteMessage={setIsDeleteMessage} deleteMessage={deleteMessage}/>
                    </BottomModal>
                    <View className="w-full justify-between flex-row">
                        {/* Business name */}
                        <Text
                            className="text-base text-ship-gray-400">{message.business_user_profile.business_name}</Text>
                        {/* Delete message */}
                        {/* <Text className="text-xs text-gray-500">delete</Text> */}
                        <TouchableOpacity
                            className=" h-7 w-5"
                            onPress={() => {
                                setIsDeleteMessage(true);
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                            }}>
                            {/* <DELETE width={16} height={16} fill={"#A0A0A0"} /> */}
                            {/* <MaterialCommunityIcons name="delete-forever-outline" size={20} color="black" /> */}
                            <AntDesign name="delete" size={16} color="black"/>
                        </TouchableOpacity>
                    </View>

                    {/* Message content */}
                    <Text className="mb-2 text-lg text-ship-gray-900">{message.message}</Text>

                    <View className="w-full justify-between flex-row mt-1">
                        {/* Message likes */}
                        <View className="flex-row">
                            {/* <HEART width={14} height={14} fill={"#A0A0A0"} /> */}
                            <AntDesign name="heart" size={18} color="gray"/>
                            <Text className="ml-2 text-base text-ship-gray-400">{message.likes_number}</Text>
                        </View>

                        {/* Message date */}
                        <Text className="text-base text-ship-gray-400">
                            {message.date_created.split("T")[0]} {/* Display only the date part */}
                        </Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

export default WallMessage;

// Styles
const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 1.84,
        elevation: 2,
    },
    photoHeight: {
        height: Dimensions.get("window").width * 0.45,
    },
});
