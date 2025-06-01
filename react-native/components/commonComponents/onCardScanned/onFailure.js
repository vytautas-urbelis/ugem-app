import {controlStorage} from "../../../MMKV/control";
import {router} from "expo-router";

import {Text, TouchableOpacity, View} from "react-native";
import * as Haptics from "expo-haptics";
import STOP from "../../../assets/svg/stop.svg";
import {colors} from "../../../constants/colors";

const OnCardFailure = () => {

    // Check is business user or team user in control
    const isUserLogedInAsTeam = controlStorage.getBoolean("teamProfile");

    const onClose = () => {
        if (isUserLogedInAsTeam) {
            router.navigate("homeTeam");
        } else {
            router.navigate("homeBusiness");
        }

        // setErrorVisible(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };
    return (
        <View className="bg-whiteflex-1 justify-center items-center w-full rounded-2xl">
            {/*<View className="h-2/3 items-center justify-center">*/}
            {/*  <Text className="text-5xl text-center text-gray-100">{responseMessage}</Text>*/}
            {/*</View>*/}
            <View className="w-[100%] justify-center items-center">
                <STOP width={300} height={300} fill={colors.zest["400"]}/>
            </View>
            <View className="w-[100%] h-16 justify-center items-center">
                <Text className={'text-3xl font-semibold'}>Wrong QR code :(</Text>
            </View>

            <TouchableOpacity onPress={onClose}>
                <Text className=" pt-28 text-start text-2xl text-neutral-200">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default OnCardFailure;
