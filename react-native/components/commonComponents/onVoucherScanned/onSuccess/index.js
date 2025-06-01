import {router} from "expo-router";
import {Text, TouchableOpacity, View} from "react-native";
import * as Haptics from "expo-haptics";

const OnVoucherSuccess = () => {

    const onClose = () => {
        router.dismiss()

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };
    return (
        <View className="bg-green-600 flex-1 justify-center items-center w-full rounded-2xl">
            <View className="h-2/3 justify-center items-center">
                <Text className="text-5xl text-center text-gray-100">Success!</Text>
            </View>

            <TouchableOpacity onPress={onClose}>
                <Text className=" pt-28 text-start text-2xl text-neutral-200">Close</Text>
            </TouchableOpacity>
        </View>
    );
};

export default OnVoucherSuccess;
