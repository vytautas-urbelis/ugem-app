import {View, Text, Image, TouchableOpacity, StyleSheet} from "react-native";
import LOGO from "../../../../../../assets/default-promotion.jpg";
import {useState} from "react";
import {Feather} from "@expo/vector-icons";
import {MEDIA_URL} from "../../../../../../utils/CONST";

const IncomingRequest = ({request, HandleRequestEvent}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <View style={styles.shadow}
              className="w-full mt-2 bg-ship-gray-50 p-2 rounded-lg border border-ship-gray-100 mb-1">
            <View className="flex-row m-1">
                <View className="w-2/12">
                    {request.requester.business_user_profile.logo ? (
                        <Image
                            onLoad={() => setImageLoaded(true)}
                            source={{uri: `${MEDIA_URL}${request.requester.business_user_profile.logo}`}
                            }
                            className="w-14 h-14 rounded-full"
                            alt="Business Logo"
                        />
                    ) : (
                        <View className="w-14 h-14 items-center justify-center bg-ship-gray-200 rounded-full">
                            <Text
                                className="text-2xl font-semibold">{request.requester.business_user_profile.business_name.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                </View>
                <View className=" pl-2 pr-2 justify-center w-8/12">
                    <Text className="text-ship-gray-400 text-base">Business name</Text>
                    <Text className=" text-lg text-left font-semibold text-ship-gray-900 ">
                        {request.requester.business_user_profile.business_name}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => HandleRequestEvent("rejected", request.id)}
                    className="w-2/12 rounded-lg items-center justify-center bg-blackbackground">
                    {/* <Text className="text-sm font-semibold text-whitetext">Leave</Text> */}
                    <Feather name="x" size={32} color="black"/>
                </TouchableOpacity>
            </View>

            <View className="flex-row justify-end w-full p-2 mt-2">
                {/* <TouchableOpacity
          onPress={() => HandleRequestEvent("rejected", request.id)}
          className="w-4/12 h-10 rounded-lg items-center justify-center bg-tablebackground border">
          <Text className="text-sm font-semibold text-normaltext">Reject</Text>
        </TouchableOpacity> */}
                <TouchableOpacity
                    onPress={() => HandleRequestEvent("accepted", request.id)}
                    className="w-4/12 h-10 ml-2 items-center justify-center bg-zest-400 rounded-md">
                    <Text className=" text-ship-gray-950 font-semibold text-base">Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default IncomingRequest;

// Styles
const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 1.84,
        elevation: 2,
    },
});
