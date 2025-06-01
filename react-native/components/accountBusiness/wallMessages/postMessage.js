import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import SaveLoader from "../../smallComponents/smLoader";
import {FontAwesome} from "@expo/vector-icons";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {useEffect} from "react";

export default function PostMessage({wallMessage, setWallMessage, onMessageSend, isSaving, messageRef}) {
    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(0.2);
    const translateY = useSharedValue(900);

    //   const percents = parseFloat(campaign.value_counted / campaign.value_goal);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
            transform: [{translateY: translateY.value}],
            // opacity: opacity.value,
        };
    });

    useEffect(() => {
        setTimeout(() => {
            translateY.value = withSpring(0, {damping: 1500, stiffness: 300});
            scale.value = withTiming(1, {duration: 2000, easing: Easing.out(Easing.exp)});
            // opacity.value = withTiming(1, { duration: 2000, easing: Easing.out(Easing.exp) });
        }, 1000);
    }, []);

    return (
        <Animated.View style={animatedStyle}>
            <View style={styles.shadow}
                  className="bg-white mt-8 rounded-xl flex flex-row p-3 border border-ship-gray-200">
                <View className="w-full">
                    <TextInput
                        ref={messageRef}
                        placeholder="Post something on your wall"
                        multiline
                        value={wallMessage}
                        numberOfLines={5}
                        onChangeText={(message) => setWallMessage(message)} // Update message state on change
                        className="w-full h-32 "></TextInput>

                    <View className="with-full items-end pr-1">
                        {/* Send button with loader */}
                        <TouchableOpacity
                            onPress={() => {
                                onMessageSend();
                            }}>
                            {isSaving ? (
                                <View className="h-8 w-8">
                                    <Text>
                                        <SaveLoader/> {/* Show loader while saving */}
                                    </Text>
                                </View>
                            ) : (
                                <View className="h-8 w-8">
                                    <FontAwesome name="send-o" size={20} color="black"/>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Animated.View>
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
});
