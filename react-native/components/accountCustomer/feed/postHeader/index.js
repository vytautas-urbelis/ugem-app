import {AntDesign} from "@expo/vector-icons";
import {Image, Text, View} from "react-native";
import {colors} from "../../../../constants/colors";
import {router} from "expo-router";
import {Pressable, TouchableOpacity} from "react-native-gesture-handler";

const PostHeader = ({businessProfile, distance, currentLocation, toggleFollow}) => {
    return (
        <View className="w-full flex-row gap-3 mb-2 items-center">
            {/*<Pressable onPress={() => openBusinessProfile(businessProfile.user.id)}>*/}
            <Pressable onPress={() => router.push({
                pathname: `/homeCustomer/businessProfile/${businessProfile.user.id}`,
                params: {businessID: businessProfile.user.id}
            })}>
                {businessProfile.logo ? (
                    <Image
                        source={{uri: `${businessProfile.logo}`}}
                        className="w-[48] h-[48] rounded-full "
                        alt="qr code"
                    />
                ) : (
                    <View className="w-[48] h-[48] items-center justify-center bg-ship-gray-200 rounded-full">
                        <Text
                            className="text-2xl font-semibold">{businessProfile.business_name.charAt(0).toUpperCase()}</Text>
                    </View>
                )}
            </Pressable>
            <View className="flex-shrink">
                <View className="flex-row justify-between w-full">
                    <Pressable onPress={() => router.push({
                        pathname: `/homeCustomer/businessProfile/${businessProfile.user.id}`,
                        params: {businessID: businessProfile.user.id}
                    })}
                               className="flex flex-shrink flex-wrap items-start">
                        <Text className="text-base font-semibold text-ship-gray-900 text-start text-wrap">
                            {/*{shorterText(businessProfile.business_name, 19)}*/}
                            {businessProfile.business_name}
                        </Text>
                        <View className="  justify-start items-center flex-row gap-1">
                            <Text
                                className="text-xs font-semibold  text-ship-gray-600 text-center">{businessProfile.user.rating.toFixed(1)}</Text>
                            <AntDesign name="star" size={12} color={colors["zest"][500]}/>
                            <Text
                                className="text-xs font-semibold  text-ship-gray-600 text-center">{businessProfile.user.number_of_ratings}</Text>
                        </View>
                    </Pressable>
                    <View className="justify-start items-center ">
                        {currentLocation.latitude && (
                            <Text>
                                {distance.toFixed(2) <= 5 ? (
                                    <Text
                                        className="text-sm font-semibold text-shamrock-500 text-center">{distance.toFixed(2)} km</Text>
                                ) : (distance.toFixed(2) <= 10) & (distance.toFixed(2) > 5) ? (
                                    <Text
                                        className="text-sm font-semibold text-ship-gray-600 text-center">{distance.toFixed(2)} km</Text>
                                ) : (
                                    <Text
                                        className="text-sm font-semibold text-ship-gray-200 text-center">{distance.toFixed(2)} km</Text>
                                )}
                            </Text>
                        )}
                    </View>
                </View>
                <View className="flex-row justify-between">
                    <View className="flex-row gap-1">
                        <Text className="text-xs  text-ship-gray-600 text-center">{businessProfile.city},</Text>
                        <Text className="text-xs  text-ship-gray-600 text-center">{businessProfile.country}</Text>
                    </View>

                    <View>
                        {!businessProfile.user.following && (
                            <TouchableOpacity onPress={() => toggleFollow(businessProfile.user.id)}>
                                <Text className="text-base font-semibold text-ship-gray-900 text-center">Follow</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PostHeader;
