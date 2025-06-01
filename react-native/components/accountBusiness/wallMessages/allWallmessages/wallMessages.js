import {useEffect} from "react";
import {FlatList, Pressable, Text, View} from "react-native";
import {getWallMessages, saveWallMessages} from "../../../../MMKV/mmkvBusiness/wallMessages";
import {GetWallMessages} from "../../../../axios/axiosBusiness/wallMessage";
import WallMessage from "../wallMessage";
import {TouchableOpacity} from "react-native";
import {authStorage} from "../../../../MMKV/auth";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../../MMKV/control";
import {router} from "expo-router";

const WallMessages = () => {
    const accessToken = authStorage.getString("accessToken");

    const wallMessagesList = getWallMessages();


    // Fetch wall messages on component mount
    useEffect(() => {
        const getMessages = async () => {
            try {
                const messages = await GetWallMessages(accessToken); // Fetch wall messages
                saveWallMessages(messages); // Save messages locally
            } catch (error) {
                console.log(error);
            }
        };

        getMessages();
    }, []);
    return (
        <View className="flex-1 bg-ship-gray-50">
            <View
                className="pl-4 h-26 pt-8 items-center flex-row justify-between bg-ship-gray-50 border-b border-b-ship-gray-200">
                <Text className="text-3xl font-bold text-normaltext">Wall messages</Text>
                <TouchableOpacity
                    className="mr-6 items-center justify-center h-16 pt-4"
                    onPress={() => router.back()}>
                    <Text className="text-lg pb-3 text-normaltext">Done</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                className="flex-1 pl-3 pr-3 bg-white"
                data={wallMessagesList} // Array of data to display
                renderItem={({item, index}) => (
                    <Pressable>
                        <WallMessage message={item} index={index}/>
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()} // Unique key for each item
            ></FlatList>
        </View>
    );
};

export default WallMessages;
