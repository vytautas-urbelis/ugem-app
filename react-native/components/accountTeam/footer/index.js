import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Haptics from "expo-haptics";

import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../MMKV/control";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "../../../constants/colors";
import {router} from "expo-router";

export default function Footer() {
    // Check is business user or team user in controll
    const isUserLogedInAsTeam = controlStorage.getBoolean("teamProfile");
    const [isScan, setIsScan] = useMMKVBoolean("isScan", controlStorage);

    return (
        <>
            <View
                className="p-0 flex flex-row items-center justify-center h-28 bg-ship-gray-50 border-t border-gray-200">
                <View className="items-center justify-center w-full flex-row pl-4 pr-4">
                    <TouchableOpacity
                        onPress={() => {
                            // navigate("scann");
                            // setIsScan(true);
                            router.push('homeTeam/scann')
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                        }}
                        style={styles.shadow}
                        className="pt-1 pb-1 w-full flex flex-col items-center justify-center  rounded-lg bg-ship-gray-800">
                        {/* <QR width={30} height={30} fill={"#444"} /> */}
                        <Ionicons name="qr-code-outline" size={28} color={"white"}/>

                        <Text className="text-lg text-white font-bold">Scan Card</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

// Styles
const styles = StyleSheet.create({
    shadow: {
        shadowColor: colors["zest"][800],
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 2,
    },
});
