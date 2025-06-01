import {Feather} from "@expo/vector-icons";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {colors} from "../../constants/colors";

import * as Haptics from "expo-haptics";
import {Pressable, TextInput} from "react-native-gesture-handler";

export const SeacrhInputComponent = ({setValue, value, placeholder, loader}) => {
    return (
        <View
            className={`mt-3 border border-ship-gray-200  items-center justify-between flex-row bg-white rounded-xl h-12`}>
            <TextInput
                className="w-11/12 pl-3 pb-2 text-lg h-12"
                onChangeText={(description) => setValue(description)}
                value={value}
                placeholder={placeholder}
                autoCapitalize="none"
            />
            {loader ? (
                <View className="w-1/12">
                    <ActivityIndicator/>
                </View>
            ) : (
                <></>
            )}
            {!loader && value ? (
                <View className="w-1/12">
                    <Pressable
                        onPress={() => {
                            setValue(""), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}>
                        <Feather name="x-circle" size={20} color={colors["ship-gray"]["400"]}/>
                    </Pressable>
                </View>

            ) : (
                <></>
            )}
        </View>
    );
};

export const DescriptionInputComponent = ({setValue, value, label, placeholder}) => {
    return (
        <View style={styles.shadow} className={`ml-3 mr-3 mt-3 p-1  items-center bg-white rounded-xl `}>
            <Text className=" text-blue-500 w-full pt-1 pl-3 text-left text-xs">{label}</Text>
            <TextInput
                multiline={true}
                numberOfLines={5}
                className=" w-full pl-3 pb-1 text-sm"
                onChangeText={(description) => setValue(description)}
                value={value}
                placeholder={placeholder}
                autoCapitalize="none"
            />
        </View>
    );
};

export const WebsiteInputComponent = ({setValue, value, label, placeholder}) => {
    return (
        <View style={styles.shadow} className={`ml-3 mr-3 mt-3 p-1  items-center bg-white rounded-xl `}>
            <Text className=" text-blue-500 w-full pt-1 pl-3 text-left text-xs">{label}</Text>
            <View className="flex-row w-full">
                <View className="items-center justify-center">
                    <Text className=" w-full pl-3 text-base text-gray-400">https://</Text>
                </View>
                <View>
                    <TextInput
                        className=" w-full pl-3 pb-1 text-sm"
                        onChangeText={(description) => setValue(description)}
                        value={value}
                        placeholder={placeholder}
                        autoCapitalize="none"
                    />
                </View>
            </View>
        </View>
    );
};

export const TextInputEditProfileComponent = ({setValue, value, label, placeholder}) => {
    return (
        <View style={styles.shadow} className={`ml-3 mr-3 mt-3 p-1  items-center bg-white rounded-xl `}>
            <Text className=" text-blue-500 w-full pt-1 pl-3 text-left text-xs">{label}</Text>

            <TextInput
                autoCorrect={false}
                className=" w-full pl-3 pb-1 text-sm"
                onChangeText={(text) => setValue(text)}
                value={value}
                placeholder={placeholder}
                autoCapitalize="none"
            />
        </View>
    );
};

export const TextInputComponent = ({setValue, value, label, placeholder}) => {
    return (
        <View style={styles.shadow} className={`ml-3 mr-3 mt-3 p-1  items-center bg-white rounded-xl `}>
            <Text className=" text-blue-500 w-full pt-1 pl-3 text-left text-xs">{label}</Text>

            <TextInput
                autoCorrect={false}
                className=" w-full pl-3 pb-1 text-sm"
                onChangeText={(text) => setValue(text)}
                // value={value}
                placeholder={placeholder}
                autoCapitalize="none"
            />
        </View>
    );
};

export const PasswordInputComponent = ({setValue, value, label, placeholder}) => {
    return (
        <View style={styles.shadow} className={`ml-3 mr-3 mt-3 p-1  items-center bg-white rounded-xl `}>
            <Text className=" text-blue-500 w-full pt-1 pl-3 text-left text-xs">{label}</Text>

            <TextInput
                className=" w-full pl-3 pb-1 text-sm"
                onChangeText={(description) => setValue(description)}
                // value={value}
                secureTextEntry={true}
                placeholder={placeholder}
                autoCapitalize="none"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 1.84,
        elevation: 10,
    },
});
