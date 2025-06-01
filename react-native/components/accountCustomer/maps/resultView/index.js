import {AntDesign} from "@expo/vector-icons";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {colors} from "../../../../constants/colors";
import {shorterText} from "../../../../utils/textFormating";
import {RectButton} from "react-native-gesture-handler";

const ResultView = ({result, initialRegion, handleOnResultPress, setSearchValue}) => {
    return (

        <RectButton
            onPress={() => {
                handleOnResultPress(parseFloat(result.data.latitude), parseFloat(result.data.longitude), result.data);
                setSearchValue(result.data.business_name)
            }}
            className="w-full flex-row gap-2 px-3 py-2">
            <View className="w-full flex-row gap-2 px-3 py-2">
                {result.data.logo ? (
                    <Image
                        // onLoad={() => setImageLoaded(true)}
                        source={{uri: result.data.logo}}
                        className="w-12 h-12 rounded-full border border-ship-gray-100"
                        alt="logo"
                    />
                ) : (
                    <View
                        className="w-12 h-12 items-center justify-center bg-ship-gray-200 border border-ship-gray-200 rounded-full ">
                        <Text className="text-xl font-semibold text-ship-gray-700">
                            {result.data.business_name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
                <View className="flex-shrink">
                    <View className="flex-row justify-between w-full">
                        <View className="flex-row gap-2 flex-shrink flex-wrap">
                            <Text className="text-base font-semibold text-ship-gray-900 text-start text-wrap">
                                {shorterText(result.data.business_name, 19)}
                            </Text>
                            <View className="  justify-center items-center flex-row gap-1">
                                <Text
                                    className="text-sm font-semibold text-ship-gray-600 text-center">{result.data.user.rating.toFixed(1)}</Text>
                                <AntDesign name="star" size={12} color={colors["zest"][500]}/>
                                <Text
                                    className="text-sm font-semibold text-ship-gray-600 text-center">{result.data.user.number_of_ratings}</Text>
                            </View>
                        </View>
                        <View className="justify-center items-center ">
                            {initialRegion.latitude && (
                                <Text>
                                    {result.distance.toFixed(2) <= 5 ? (
                                        <Text
                                            className="text-sm font-semibold text-shamrock-600 text-center">{result.distance.toFixed(2)} km</Text>
                                    ) : (result.distance.toFixed(2) <= 10) & (result.distance.toFixed(2) > 5) ? (
                                        <Text
                                            className="text-sm font-semibold text-shamrock-600 text-center opacity-90">{result.distance.toFixed(2)} km</Text>
                                    ) : (result.distance.toFixed(2) <= 20) & (result.distance.toFixed(2) > 10) ? (
                                        <Text
                                            className="text-sm font-semibold text-shamrock-600 text-center opacity-80">{result.distance.toFixed(2)} km</Text>
                                    ) : (result.distance.toFixed(2) <= 20) & (result.distance.toFixed(2) > 15) ? (
                                        <Text
                                            className="text-sm font-semibold text-shamrock-600 text-center opacity-70">{result.distance.toFixed(2)} km</Text>
                                    ) : (result.distance.toFixed(2) <= 25) & (result.distance.toFixed(2) > 20) ? (
                                        <Text
                                            className="text-sm font-semibold text-shamrock-600 text-center opacity-60">{result.distance.toFixed(2)} km</Text>
                                    ) : (result.distance.toFixed(2) <= 30) & (result.distance.toFixed(2) > 25) ? (
                                        <Text
                                            className="text-sm font-semibold text-shamrock-600 text-center opacity-50">{result.distance.toFixed(2)} km</Text>
                                    ) : (result.distance.toFixed(2) <= 35) & (result.distance.toFixed(2) > 30) ? (
                                        <Text
                                            className="text-sm font-semibold text-shamrock-600 text-center opacity-40">{result.distance.toFixed(2)} km</Text>
                                    ) : (
                                        <Text
                                            className="text-sm font-semibold text-shamrock-600 text-center opacity-20">{result.distance.toFixed(2)} km</Text>
                                    )}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View className="flex-row justify-between">
                        <View className="flex-row gap-1">
                            <Text className="text-xs  text-ship-gray-600 text-center">{result.data.city},</Text>
                            <Text className="text-xs  text-ship-gray-600 text-center">{result.data.country}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </RectButton>

    );
};

export default ResultView;
