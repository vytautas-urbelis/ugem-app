import {Image, Keyboard, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
// Import custom components
import {authStorage} from "../../../MMKV/auth";
import {FontAwesome5, Foundation} from "@expo/vector-icons";
import {ScrollView, TextInput} from "react-native-gesture-handler";
import {pickImage, takeImage} from "../../../utils/imagePicker";
import {getCustomerMMKV} from "../../../MMKV/mmkvCustomer/user";
import {updateAccount} from "../../../axios/axiosCustomer/customerAuth";
import {MEDIA_URL} from "../../../utils/CONST";
import {colors} from "../../../constants/colors";
import {router} from "expo-router";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../MMKV/control";

export default function EditProfile() {
    //   // User and business data from local storage
    const accessToken = authStorage.getString("accessToken");
    const customerUser = getCustomerMMKV();

    // Component state variables
    const [isSaving, setIsSaving] = useState(false);
    const [avatar, setAvatar] = useState();
    const [country, setCountry] = useState(customerUser.customer_user_profile.country);
    const [city, setCity] = useState(customerUser.customer_user_profile.city);
    const [nickname, setNickname] = useState(customerUser.customer_user_profile.nickname);
    const [visibleKeyboard, setVisibleKeyboard] = useState(false);

    // MMKV booleans for modals
    const [refreshCustomerProfile, setRefreshCustomerProfile] = useMMKVBoolean("refreshCustomerProfile", controlStorage);

    const scrollViewRef = useRef(null);

    // Effect to manage keyboard visibility
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setVisibleKeyboard(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setVisibleKeyboard(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        if (visibleKeyboard) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);
        }
    }, [visibleKeyboard]);

    // Function to handle saving profile updates
    const onSave = async () => {
        const formData = new FormData();
        // formData.append("first_name", firstName);
        // formData.append("last_name", lastName);
        formData.append("country", country);
        formData.append("city", city);
        formData.append("nickname", nickname);
        // formData.append("street", street);
        // formData.append("street_number", streetNumber);
        // formData.append("zip", zip);

        if (avatar) {
            formData.append("avatar", {
                uri: avatar.uri,
                name: avatar.fileName || "image.jpg", // Default name if not provided
                type: avatar.mimeType || "image/jpeg", // Default type if not provided
            });
        }

        setIsSaving(true);
        try {
            // Update account with the new data
            await updateAccount(accessToken, formData);
            // const userData = await GetMeUser(accessToken);
            // console.log(userData);
            // saveCustomerMMKV(userData);
            setRefreshCustomerProfile(!refreshCustomerProfile);

            // Provide feedback on successful save
            // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back()
        } catch (error) {
            console.log(error);
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <>
            <View className="w-full flex-1 justify-center items-center ">
                {/*<PanGestureHandler onGestureEvent={onGestureEvent}>*/}
                <View className="flex-1 w-screen h-screen">
                    <View
                        className="pl-4 h-26 pt-8 items-center flex-row justify-between bg-ship-gray-50 border-b border-b-ship-gray-200">
                        <Text className="text-3xl font-bold text-normaltext">Edit profile</Text>
                        <TouchableOpacity className="mr-6 items-center justify-center h-16 pt-4"
                                          onPress={() => onSave()}>
                            <Text className="text-lg pb-3 text-normaltext">Save</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView keyboardShouldPersistTaps="handled" className="flex-1 bg-white" ref={scrollViewRef}>
                        {/* <Pressable> */}

                        <View className="p-4 rounded-xl h-full w-full max-w-[600]">
                            {/* Display the business logo or default image */}
                            <Text className="text-ship-gray-700  text-left text-xl mb-1 bg-white">Profile
                                picture</Text>
                            <View className="items-center justify-start flex-row mb-8 relative w-36">
                                <View>
                                    {customerUser.customer_user_profile.avatar ? (
                                        <Image
                                            source={avatar ? avatar : {uri: `${MEDIA_URL}${customerUser.customer_user_profile.avatar}`}}
                                            className="w-36 h-36 mt-1 rounded-xl "
                                            alt="qr code"
                                        />
                                    ) : (
                                        <View
                                            className="w-36 h-36 mt-1 rounded-xl items-center justify-center bg-ship-gray-200">
                                            {avatar ? (
                                                <Image source={avatar} className="w-36 h-36 mt-1 rounded-xl "
                                                       alt="qr code"/>
                                            ) : (
                                                <Text className="text-6xl font-semibold">
                                                    {customerUser.customer_user_profile.nickname.charAt(0).toUpperCase()}
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                    {/* <Image
                        source={
                          logo
                            ? logo
                            : customerUser.customer_user_profile.avatar
                              ? { uri: `https://swiftybee.ch/${customerUser.customer_user_profile.avatar}` }
                              : BUSINESS
                        }
                        className="w-36 h-36 mt-1 rounded-xl "
                        alt="qr code"
                      /> */}
                                </View>

                                {/* Image selection buttons */}
                                {/* <View className="pl-3 pr-3 h-32 flex justify-between"> */}

                                <View className="absolute -bottom-5 left-2">
                                    <TouchableOpacity onPress={() => pickImage(setAvatar)}>
                                        <View
                                            className={` bg-white p-3 w-12 h-12 items-center justify-center  rounded-full flex flex-row border border-gray-200`}>
                                            <Foundation name="photo" size={20} color="black"/>
                                            {/* <Text className="text-base text-center">Select</Text> */}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View className=" absolute -bottom-5 right-2">
                                    <TouchableOpacity onPress={() => takeImage(setAvatar)}>
                                        <View
                                            className={` bg-white w-12 p-3 h-12 items-center justify-center   rounded-full flex flex-row border border-gray-200`}>
                                            <FontAwesome5 name="camera" size={20} color="black"/>
                                            {/* <Text className="text-base text-center">Shoot</Text> */}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* </View> */}
                            </View>
                            <View className="mb-6 w-full mt-4">
                                <TextInput
                                    style={{borderColor: colors["ship-gray"]["200"]}}
                                    className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white"
                                    onChangeText={(text) => setNickname(text)}
                                    value={nickname}
                                />
                                <Text
                                    className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Nickname
                                </Text>
                            </View>
                            <View className="mb-6 w-full mt-4">
                                <TextInput
                                    style={{borderColor: colors["ship-gray"]["200"]}}
                                    className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white"
                                    onChangeText={(text) => setCountry(text)}
                                    value={country}
                                />
                                <Text
                                    className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Country
                                </Text>
                            </View>

                            <View className="mb-6 w-full mt-4">
                                <TextInput
                                    style={{borderColor: colors["ship-gray"]["200"]}}
                                    className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white"
                                    onChangeText={(text) => setCity(text)}
                                    value={city}
                                />
                                <Text
                                    className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">City
                                </Text>
                            </View>

                            <View className="border-b border-b-gray-200 mb-10"></View>

                            {/* <WebsiteInputComponent setValue={setWebsite} value={website} label={"Website"} /> */}

                            <View className="mb-10 w-full">
                                {/* Save button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        onSave()
                                    }}
                                    className="w-full rounded-lg bg-ship-gray-900 items-center justify-center">
                                    <Text className="text-center w-full p-5 text-white font-semibold text-xl">Save
                                        changes</Text>
                                </TouchableOpacity>

                                {/* Back button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        router.back()
                                    }}
                                    className="w-full rounded-lg bg-white items-center justify-center mt-6 border border-ship-gray-900">
                                    <Text
                                        className="text-center w-full p-5 text-ship-gray-900 font-semibold text-xl">Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Placeholder for keyboard visibility adjustment */}
                        {visibleKeyboard && <View className=" h-40"></View>}
                        {/* </Pressable> */}
                    </ScrollView>
                </View>
                {/*</PanGestureHandler>*/}
            </View>
        </>
    );
}
