import {Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {Modal, SlideAnimation} from "react-native-modals";
import * as Haptics from "expo-haptics";
import {AddBusinessUserProifile, GetBusinessCategoryList,} from "../../axios/axiosBusiness/businessAuth";
import Address from "../../components/smallComponents/address";
import {Checkbox} from "../../components/smallComponents/checkbox";
import DropdownComponent from "../../components/smallComponents/dropDown";
import {colors} from "../../constants/colors";
import {MEDIA_URL} from "../../utils/CONST";
import UGEM from "../../assets/svg/uGem.svg";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import SaveLoader from "../../components/smallComponents/smLoader";

const CreateBusinessUserProifile = ({setRefresh, setCreateBusinessProfile, setIsSwitchProfiles, accessToken}) => {
    // State hooks for managing form data, errors, and UI loading states
    const [loader, setLoader] = useState(false); // Loader state for handling loading UI
    const [error, setError] = useState(""); // Error message state
    const [visibleKeyboard, setVisibleKeyboard] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    const [businessName, setBusinessName] = useState(null); // Business name input state
    const [selectedCategory, setSelectedCategory] = useState(null); // Selected category state

    const [categoryList, setCategoryList] = useState([]); // List of business categories

    // Address-related states
    const [streetNumber, setStreetNumber] = useState(null);
    const [street, setStreet] = useState(null);
    const [city, setCity] = useState(null);
    const [country, setCountry] = useState(null);
    const [postalCode, setPostalCode] = useState(null);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [isAddress, setIsAddress] = useState(false); // State to toggle address modal visibility

    // Animation settings
    const scale = useSharedValue(0.7);
    const opacity = useSharedValue(0.2);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
            opacity: opacity.value,
        };
    });

    useEffect(() => {

        scale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
        opacity.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});


    }, []);

    useEffect(() => {
        // Fetch business category list on component mount
        const getBusinessCategoryList = async () => {
            let list = [];
            try {
                const res = await GetBusinessCategoryList();
                for (let i = 0; i < res.length; i += 1) {
                    list.push({label: res[i].name, value: res[i].id});
                }
                setCategoryList(list);
            } catch (error) {
                console.log(error);
            }
        };

        getBusinessCategoryList();
    }, []);

    // Ensure all required fields are filled in
    const checkIfFiledIn = () => {
        if (businessName && streetNumber && street && city && country && selectedCategory && postalCode) {
            setError("");
            return true;
        } else {
            setError("You need to fill in all fields.");
            return false;
        }
    };

    // Check if the email is valid
    const checkIfAgreeTS = () => {
        if (!isSelected) {
            setError("Please agree to our Privacy Policy and Terms of Service.");
            return false;
        }
        setError("");
        return true;
    };

    // Handle Business profile creation form submission
    const handleBusinessProfileCreation = async () => {
        setLoader(true); // Show loader
        try {
            if (checkIfFiledIn() && checkIfAgreeTS()) {
                try {
                    // Call API to register business
                    await AddBusinessUserProifile(
                        accessToken,
                        businessName,
                        selectedCategory,
                        postalCode,
                        streetNumber,
                        street,
                        city,
                        country,
                        lat,
                        lng,
                    );
                    setRefresh((value) => !value);
                    setCreateBusinessProfile(false); // Close signup modal
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } catch (error) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    console.log(error.response.data);
                    alert("Something went wrong.");
                } finally {
                    setLoader(false); // Hide loader
                }
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        } catch {
        } finally {
            setLoader(false); // Ensure loader is hidden
        }
    };

    return (

        <ScrollView nestedScrollEnabled={true} className="h-screen w-screen p-6 flex-1">
            <Modal
                style={{zIndex: 2}}
                visible={isAddress}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "top",
                    })
                }>
                <Address
                    setIsAddress={setIsAddress}
                    setStreetNumber={setStreetNumber}
                    setStreet={setStreet}
                    setCity={setCity}
                    setCountry={setCountry}
                    setPostalCode={setPostalCode}
                    setLat={setLat}
                    setLng={setLng}
                />
            </Modal>
            <Pressable className={'w-full items-center justify-center'}>
                <Animated.View style={animatedStyle} className="w-full max-w-[360] mt-14">

                    <View className="w-full items-center mb-12">
                        <UGEM width={200} height={36} fill={colors.zest["400"]}/>
                    </View>

                    {/* Address modal for selecting business address */}

                    <View className="flex flex-1 w-full">
                        {/* Form Container */}
                        <View className="px-2  flex-1 justify-center items-center flex">
                            <View className="flex flex-row">
                                <Text className="pb-4 font-bold mb-2 text-stone-800 text-center text-xl">
                                    Please create Business profile.
                                </Text>
                            </View>

                            {/* Input fields for signup */}
                            {/* <View className="w-full">
              <TextInputComponent label={"Email"} placeholder="Email" value={email} setValue={setEmail} />
            </View> */}

                            <View className="mb-6 w-full">
                                <TextInput
                                    style={{borderColor: colors["ship-gray"]["200"]}}
                                    className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white"
                                    inputMode={"email"}

                                    onChangeText={(text) => setBusinessName(text)}
                                />
                                <Text
                                    className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Business
                                    Name
                                </Text>
                            </View>
                            <View className="w-full mb-2">
                                <DropdownComponent
                                    itemList={categoryList}
                                    setSelectedItem={setSelectedCategory}
                                    selectedItem={selectedCategory}
                                    label={"Business categories"}
                                />
                            </View>

                            {/* Address selection button */}
                            <View className="mb-4 w-full">
                                {/*<View style={styles.shadow} className="w-full bg-white rounded-xl">*/}

                                <TouchableOpacity onPress={() => setIsAddress(true)}
                                                  className="text-xl border p-3 py-5 border-ship-gray-200 rounded-lg bg-white">

                                    <Text className=" text-lg">
                                        {streetNumber ? (
                                            `${country}, ${city}, ${street} ${streetNumber}`
                                        ) : (
                                            <Text className="text-[#C0C0C0] text-xl">Select address</Text>
                                        )}
                                    </Text>
                                </TouchableOpacity>
                                <Text
                                    className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Business
                                    address
                                </Text>
                                {/*</View>*/}
                            </View>

                            {/* Password fields */}
                            {/* <View className="w-full">
              <PasswordInputComponent
                label={"Password"}
                placeholder="Password"
                value={password}
                setValue={setPassword}
              />
            </View>
            <View className="w-full">
              <PasswordInputComponent
                label={"Repeat password"}
                placeholder="Repeat Password"
                value={repeatPassword}
                setValue={setRepeatPassword}
              />
            </View> */}
                            {error ? <Text
                                className="text-center  w-full text-red-500 text-lg mb-1">{error}</Text> : null}
                            <View className="mt-2 flex-row inline-block items-start justify-between w-full">
                                <View className="flex-shrink"><Text className="text-base text-left">

                                    I am 18 years of age or older and agree to the uGem
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL(`${MEDIA_URL}privacy-policy`)}>
                                        <Text className="font-bold "> Privacy Policy </Text>
                                    </TouchableOpacity>
                                    and
                                    <TouchableOpacity onPress={() => Linking.openURL(`${MEDIA_URL}terms-of-use`)}>
                                        <Text className="font-bold "> Terms of Service</Text>
                                    </TouchableOpacity>
                                    .
                                </Text></View>

                                <TouchableOpacity
                                    onPress={() => {
                                        setIsSelected(!isSelected);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    }}>
                                    <Checkbox size={24} isChecked={isSelected} color={colors['zest']["500"]}></Checkbox>
                                </TouchableOpacity>
                            </View>

                            {/* Submit button */}

                            <TouchableOpacity
                                disabled={loader}
                                onPress={handleBusinessProfileCreation}
                                className="w-full rounded-lg bg-ship-gray-900 items-center justify-center mt-6">
                                {loader ? (
                                    <View className="p-5">
                                        <SaveLoader/>
                                    </View>
                                ) : (
                                    <Text className="text-center w-full p-5 text-white font-semibold text-xl">Sign
                                        Up</Text>
                                )}
                            </TouchableOpacity>
                            <View className="w-full mt-5 pr-3 pl-3">
                                <View className="w-full border-b border-b-gray-100 "></View>
                            </View>
                        </View>
                    </View>

                    {/* Button to switch to login modal */}
                    <TouchableOpacity
                        className="mt-5 w-full items-center"
                        onPress={() => {
                            // setIsSwitching(false);
                            setCreateBusinessProfile(false);
                        }}>
                        <Text className="font-bold items-center">
                            <Text className="text-gray-600 font-normal">Go</Text> Back
                        </Text>
                    </TouchableOpacity>
                    {/* {visibleKeyboard && <View className=" h-80"></View>} */}
                </Animated.View>
            </Pressable>
        </ScrollView>
    );
};

export default CreateBusinessUserProifile;

// Styles for shadows
const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 7.84,
        elevation: 10,
    },
});
