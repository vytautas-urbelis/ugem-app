import {Image, Keyboard, Text, TouchableOpacity, View} from "react-native";
import {getBusinessMMKV} from "../../../MMKV/mmkvBusiness/user";
import React, {useEffect, useRef, useState} from "react";

import * as Haptics from "expo-haptics"; // Import Haptics for feedback
// Import default business image
// Import custom components
import {updateAccount} from "../../../axios/axiosBusiness/businessAuth";
import Address from "../../smallComponents/address";
import {Modal, SlideAnimation} from "react-native-modals";
import {authStorage} from "../../../MMKV/auth";
import {FontAwesome5, Foundation} from "@expo/vector-icons";
import {ScrollView, TextInput} from "react-native-gesture-handler";
import {pickImage, takeImage} from "../../../utils/imagePicker";
import {MEDIA_URL} from "../../../utils/CONST";
import {colors} from "../../../constants/colors";
import {router} from "expo-router";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../MMKV/control";

export default function EditProfile() {
    // User and business data from local storage
    const accessToken = authStorage.getString("accessToken");
    const businessUser = getBusinessMMKV();

    // Component state variables
    const [value, setValue] = useState(50);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddress, setIsAddress] = useState(false); // State to toggle address modal visibility
    const [logo, setlogo] = useState();
    const [shopImage, setShopImage] = useState();
    const [businessName, setBusinessName] = useState(businessUser.business_user_profile.business_name);
    const [about, setAbout] = useState(businessUser.business_user_profile.about);
    const [country, setCountry] = useState(businessUser.business_user_profile.country);
    const [city, setCity] = useState(businessUser.business_user_profile.city);
    const [street, setStreet] = useState(businessUser.business_user_profile.street);
    const [streetNumber, setStreetNumber] = useState(businessUser.business_user_profile.street_number);
    const [zip, setZip] = useState(businessUser.business_user_profile.zip);
    const [website, setWebsite] = useState(businessUser.business_user_profile.website.replace(/^https?:\/\//, ""));
    const [lat, setLat] = useState(businessUser.business_user_profile.latitude);
    const [lng, setLng] = useState(businessUser.business_user_profile.longitude);
    const [visibleKeyboard, setVisibleKeyboard] = useState(false);

    const [refreshBusinessFeed, setRefreshBusinessFeed] = useMMKVBoolean("refreshBusinessFeed", controlStorage);

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
        console.log(typeof lng, (parseFloat(lng) + Math.random() * 0.00005).toFixed(9));
        const formData = new FormData();
        formData.append("business_name", businessName);
        formData.append("about", about);
        formData.append("country", country);
        formData.append("city", city);
        formData.append("street", street);
        formData.append("street_number", streetNumber);
        // formData.append("latitude", (parseFloat(lat) + Math.random() * 0.00007).toFixed(9));
        formData.append("latitude", lat);
        // formData.append("longitude", (parseFloat(lng) + Math.random() * 0.00007).toFixed(9));
        formData.append("longitude", lng);
        formData.append("zip", zip);

        if (website) {
            formData.append("website", "https://" + website);
        }

        if (logo) {
            formData.append("logo", {
                uri: logo.uri,
                name: logo.fileName || "image.jpg", // Default name if not provided
                type: logo.mimeType || "image/jpeg", // Default type if not provided
            });
        }

        if (shopImage) {
            formData.append("shop_image", {
                uri: shopImage.uri,
                name: shopImage.fileName || "image.jpg", // Default name if not provided
                type: shopImage.mimeType || "image/jpeg", // Default type if not provided
            });
        }

        setIsSaving(true);
        try {
            // Update account with the new data
            await updateAccount(accessToken, formData);
            // const userData = await GetMeUser(accessToken);
            // saveBusinessMMKV(userData);

            setRefreshBusinessFeed(!refreshBusinessFeed)

            // Provide feedback on successful save
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Close edit profile mode and navigate back to account screen
            router.back()
            // router.navigate("/home/account");
        } catch (error) {
            console.log(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {/* Address modal for selecting business address */}
            <Modal
                style={{zIndex: 3}}
                visible={isAddress}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "top",
                    })
                }>
                <View className="items-center justify-start">
                    <Address
                        setIsAddress={setIsAddress}
                        setStreetNumber={setStreetNumber}
                        setStreet={setStreet}
                        setCity={setCity}
                        setCountry={setCountry}
                        setPostalCode={setZip}
                        setLat={setLat}
                        setLng={setLng}
                    />
                </View>
            </Modal>
            <View className="w-full flex-1 justify-center items-center ">
                <View className="flex-1">
                    <View
                        className="bg-ship-gray-50 pl-4 h-26 pt-8 items-center flex-row justify-between bg-tablebackground border-b border-b-ship-gray-200">
                        <Text className="text-3xl font-bold text-normaltext">Edit profile</Text>
                        <TouchableOpacity className="mr-6 items-center justify-center h-16 pt-4"
                                          onPress={() => onSave()}>
                            <Text className="text-lg pb-3 text-normaltext">Save</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView keyboardShouldPersistTaps="handled" className="flex-1 bg-white p-4" ref={scrollViewRef}>
                        <View className="rounded-xl h-full w-full">
                            {/* Display the business logo or default image */}
                            <Text className="text-ship-gray-700  text-left text-xl mb-1 bg-white px-2">Business
                                logo</Text>
                            <View className="items-center justify-start flex-row mb-8 relative w-36">
                                {businessUser.business_user_profile.logo ? (
                                    <Image
                                        source={logo ? logo : {uri: `${MEDIA_URL}${businessUser.business_user_profile.logo}`}}
                                        className="w-36 h-36 mt-1 rounded-xl "
                                        alt="qr code"
                                    />
                                ) : (
                                    <View
                                        className="w-36 h-36 mt-1 rounded-xl items-center justify-center bg-ship-gray-200">
                                        {logo ? (
                                            <Image source={logo} className="w-36 h-36 mt-1 rounded-xl "
                                                   alt="qr code"/>
                                        ) : (
                                            <Text className="text-6xl font-semibold">
                                                {businessUser.business_user_profile.business_name.charAt(0).toUpperCase()}
                                            </Text>
                                        )}
                                    </View>
                                )}

                                <View className="absolute -bottom-5 left-2">
                                    <TouchableOpacity onPress={() => pickImage(setlogo)}>
                                        <View
                                            className={` bg-white p-3 w-12 h-12 items-center justify-center  rounded-full flex flex-row border border-gray-200`}>
                                            <Foundation name="photo" size={20} color="black"/>
                                            {/* <Text className="text-base text-center">Select</Text> */}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View className=" absolute -bottom-5 right-2">
                                    <TouchableOpacity onPress={() => takeImage(setlogo)}>
                                        <View
                                            className={` bg-white w-12 p-3 h-12 items-center justify-center   rounded-full flex flex-row border border-gray-200`}>
                                            <FontAwesome5 name="camera" size={20} color="black"/>
                                            {/* <Text className="text-base text-center">Shoot</Text> */}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* </View> */}
                            </View>
                            <View className="w-full mb-4">
                                <Text
                                    className="text-ship-gray-700  text-left text-xl mb-1 bg-white px-2">Business
                                    image</Text>
                                {businessUser.business_user_profile.shop_image ? (
                                    <View
                                        // style={styles.shadowGray}
                                        className="w-full">
                                        <Image
                                            source={shopImage ? shopImage : {uri: `${MEDIA_URL}${businessUser.business_user_profile.shop_image}`}}
                                            className="w-full h-48 rounded-lg "
                                            alt="qr code"
                                        />
                                    </View>
                                ) : (
                                    <View className="w-full">
                                        {shopImage ? (
                                            <Image source={shopImage} className="w-full h-48 rounded-lg "
                                                   alt="qr code"/>
                                        ) : (
                                            <View
                                                className="w-full h-48 rounded-lg  items-center justify-center bg-ship-gray-200">
                                                <Text className="text-6xl font-semibold">No image</Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                <View className="absolute -bottom-5 right-20">
                                    <TouchableOpacity onPress={() => pickImage(setShopImage)}>
                                        <View
                                            className={` bg-white p-3 w-12 h-12 items-center justify-center  rounded-full flex flex-row border border-gray-200`}>
                                            <Foundation name="photo" size={20} color="black"/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View className=" absolute -bottom-5 right-2">
                                    <TouchableOpacity onPress={() => takeImage(setShopImage)}>
                                        <View
                                            className={` bg-white w-12 p-3 h-12 items-center justify-center   rounded-full flex flex-row border border-gray-200`}>
                                            <FontAwesome5 name="camera" size={20} color="black"/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="mb-6 w-full mt-4">
                                <TextInput
                                    style={{borderColor: colors["ship-gray"]["200"]}}
                                    className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white"
                                    onChangeText={(text) => setBusinessName(text)}
                                    value={businessName}
                                />
                                <Text
                                    className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Business
                                    name
                                </Text>
                            </View>

                            <View className="mb-6 w-full mt-4 flex-row justify-between gap-3">
                                <View
                                    className=" w-[25%] border border-gray-200 rounded-md pb-3 pt-2 pl-4 bg-white justify-center">
                                    <Text className=" text-xl text-ship-gray-400 ">https://</Text>
                                </View>
                                <TextInput
                                    style={{borderColor: colors["ship-gray"]["200"]}}
                                    autoCapitalize='none'
                                    className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white flex-grow"
                                    onChangeText={(text) => setWebsite(text)}
                                    value={website}
                                />
                                <Text
                                    className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Website
                                </Text>
                            </View>

                            <View className="mb-6 w-full mt-4">
                                <TextInput
                                    style={{borderColor: colors["ship-gray"]["200"]}}
                                    className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white h-40"
                                    editable
                                    multiline
                                    numberOfLines={4}
                                    maxLength={200}
                                    onChangeText={(text) => setAbout(text)}
                                    value={about}
                                />
                                <Text
                                    className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">About
                                </Text>
                            </View>

                            {/* Business address selection */}
                            <View>
                                <Text
                                    className="text-ship-gray-700 text-xl mb-1 bg-white">Address</Text>
                                <Text className="text-ship-gray-400 text-lg">
                                    {country}, {city}
                                </Text>
                                <Text className="text-ship-gray-400 text-lg">
                                    {street} - {streetNumber}
                                </Text>

                                <TouchableOpacity onPress={() => setIsAddress(true)}
                                                  className="w-full mt-2 items-center">
                                    <Text className="text-zest-400 font-semibold mb-4 text-base">Change
                                        address</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="border-b border-b-gray-200 mb-10"></View>

                            <View className="mb-10 w-full">

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
                    </ScrollView>
                </View>
            </View>
        </>
    );
}
