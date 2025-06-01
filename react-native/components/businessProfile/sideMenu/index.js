import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";

import {Rating} from "@kolking/react-native-rating";
import {RateBusiness} from "../../../axios/axiosCustomer/business";
import {authStorage} from "../../../MMKV/auth";

import * as Haptics from "expo-haptics";

export default function SideMenu({
                                     toggleSubscribe,
                                     toggleFollow,
                                     businessProfile,
                                     setBusinessProfile,
                                     businessId,
                                     setIsSideMenuModal
                                 }) {
    // State to manage loading indicator
    const [isLoading, setIsLoading] = useState(false);

    const [rating, setRating] = useState(businessProfile.my_rating);

    const accessToken = authStorage.getString("accessToken");

    console.log('ssdfssd')

    const handleChange = async (rating) => {
        setRating(rating);
        if (rating > 0) {
            try {
                const res = await RateBusiness(businessId, rating, accessToken);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                const updatedBusinessProfile = {...businessProfile};
                updatedBusinessProfile["my_rating"] = res.rating;
                setBusinessProfile(updatedBusinessProfile);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <View className="flex w-full rounded-2xl justify-center items-center bg-white h-60">
            <View className="h-20" style={styles.root}>
                <Rating size={40} rating={rating} onChange={(event) => handleChange(event)} scale={1.3}/>
                <Text className="text-base mt-3 text-ship-gray-700">Rated {rating} out of 5</Text>
            </View>
            <View className="flex w-full items-center justify-center flex-row mb-10 gap-4">
                {businessProfile.subscribing ? (
                    <TouchableOpacity // Button style applied here
                        className="px-4 py-2 border-ship-gray-300 border rounded-xl "
                        onPress={toggleSubscribe} // Call logout function on press
                    >
                        <View>
                            <Text className="w-full text-sm text-ship-gray-400 text-center">Unsubscribe</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity // Button style applied here
                        className="px-4 py-2 border-zest-400 bg-zest-400 border rounded-xl "
                        onPress={toggleSubscribe} // Call logout function on press
                    >
                        <View>
                            <Text className="w-full text-sm text-center">Subscribe</Text>
                        </View>
                    </TouchableOpacity>
                )}
                {businessProfile.following ? (
                    <TouchableOpacity // Button style applied here
                        className="px-4 py-2 border-ship-gray-300 border rounded-xl"
                        onPress={toggleFollow} // Call logout function on press
                    >
                        <View>
                            <Text className="w-full text-sm text-ship-gray-400 text-center">Unfollow</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity // Button style applied here
                        className="px-4 py-2 border-zest-400 bg-zest-400 border rounded-xl"
                        onPress={toggleFollow} // Call logout function on press
                    >
                        <View>
                            <Text className="w-full text-sm text-center">Follow</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    // Shadow style for button containers
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 2, height: 6},
        shadowOpacity: 0.3,
        shadowRadius: 20.84,
        elevation: 10,
    },
    // Base button style
    button: {
        width: "33%", // 1/3 of the container width
        borderColor: "#4B5563", // Equivalent to border-zinc-700
        margin: 12, // Margin equivalent to m-3
        padding: 12, // Padding equivalent to p-3
        height: 64, // Height equivalent to h-16
        alignItems: "center", // Align items to center
        justifyContent: "center", // Justify content to center
        borderWidth: 1, // Border width of 1
        borderRadius: 12, // Border radius for rounded corners
    },
    // Additional style for cancel button
    cancelButton: {
        width: "50%", // 1/2 of the container width
    },
    root: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 17,
        marginTop: 20,
    },
});
