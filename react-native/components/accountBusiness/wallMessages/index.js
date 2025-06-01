import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from "react-native";
import {useEffect, useState} from "react"; // Import React hooks

// Importing API calls and local storage functions for messages
import {GetWallMessages} from "../../../axios/axiosBusiness/wallMessage";
import SaveLoader from "../../smallComponents/smLoader";
import {getWallMessages, saveWallMessages} from "../../../MMKV/mmkvBusiness/wallMessages";

// Importing custom components
import WallMessage from "./wallMessage";
import {authStorage} from "../../../MMKV/auth";
import {router} from "expo-router";

export default function MessagesSection({setIsWallMessages, onRefresh}) {
    // User and business information
    const accessToken = authStorage.getString("accessToken");
    const wallMessagesList = getWallMessages() ? getWallMessages() : [];

    // State variables
    const [isLoading, setIsLoading] = useState(false); // Loading state for saving message
    // const [wallMessagesList, setWallMessagesList] = useState([]);

    // Fetch wall messages on component mount
    useEffect(() => {
        setIsLoading(true);
        const getMessages = async () => {
            try {
                const messages = await GetWallMessages(accessToken); // Fetch wall messages
                saveWallMessages(messages); // Save messages locally
                // setWallMessagesList(messages);
            } catch (error) {
                console.log(error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 550)
            }
        };

        getMessages();
    }, []);

    // UI Component rendering
    return (
        <>
            {isLoading ? (
                // <View
                //   style={styles.shadow}
                //   className="bg-white m-2 mb-8 h-20 rounded-xl flex flex-row p-3 items-center justify-center">
                //   <SaveLoader className="text-slate-100" />
                // </View>
                <View className="h-screen"></View>
            ) : (
                <View className="mt-4">
                    {wallMessagesList.length !== 0 ? (
                        <View className="">
                            {wallMessagesList.slice(0, 3).map((message, index) => (
                                <WallMessage key={message.id} message={message} index={index} onRefresh={onRefresh}/>
                            ))}
                            <TouchableOpacity onPress={() => router.push('homeBusiness/wallMessages')}
                                              className="mt-1 w-full items-center">
                                <Text className="text-zest-500 text-lg">See all messages</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <></>
                    )}
                </View>
            )}
        </>
    );
}

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
