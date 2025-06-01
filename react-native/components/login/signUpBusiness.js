import {Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {AuthenticateBusiness, BusinessResgister, GetBusinessCategoryList} from "../../axios/axiosBusiness/businessAuth";
import {Modal, SlideAnimation} from "react-native-modals";
import Address from "../smallComponents/address";
import DropdownComponent from "../smallComponents/dropDown";
import {controlStorage} from "../../MMKV/control";
import {saveBusinessMMKV} from "../../MMKV/mmkvBusiness/user";
import * as Haptics from "expo-haptics";
import {Checkbox} from "../smallComponents/checkbox";
import {router} from "expo-router";
import {authStorage} from "../../MMKV/auth";
import {colors} from "../../constants/colors";
import UGEM from "../../assets/svg/uGem.svg";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {MEDIA_URL} from "../../utils/CONST";
import SaveLoader from "../smallComponents/smLoader";
import {AppleSignUp, GoogleSignUp} from "../../axios/0Auth";
import {Pressable, ScrollView, TextInput} from "react-native-gesture-handler";

const SignUpBusiness = ({
                            scrollToPage,
                            pageNumber,
                            setLoginModal,
                            email,
                            password,
                            repeatPassword,
                            googleData,
                            appleData
                        }) => {
    // State hooks for managing form data, errors, and UI loading states
    const [loader, setLoader] = useState(false); // Loader state for handling loading UI
    const [error, setError] = useState(""); // Error message state
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
        if (pageNumber === 2) {
            scale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
            opacity.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.exp)});
        }
        if (pageNumber === 0 || pageNumber === 1) {
            scale.value = withTiming(0.7, {duration: 200, easing: Easing.in(Easing.exp)});
            opacity.value = withTiming(1, {duration: 100, easing: Easing.in(Easing.exp)});
        }
    }, [pageNumber]);

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

    const handleGoogleRegister = async () => {
        setLoader(true); // Show loader
        try {
            if (checkIfFiledIn() && checkIfAgreeTS()) {
                try {
                    // Call API to register business
                    const is_business = true;
                    const user = await GoogleSignUp(
                        googleData.data,
                        googleData.data.user,
                        is_business,
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
                    setError("");
                    controlStorage.set("businessIsLogedIn", true); // Set user as logged in
                    authStorage.set("accessToken", user.access);
                    authStorage.set("refreshToken", user.refresh);
                    saveBusinessMMKV(user.business); // Save business data
                    setLoginModal(false); // Close signup modal
                    router.navigate("homeBusiness");
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } catch (error) {
                    console.log(error);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    console.log(error.response.data);
                    if (error.response.data.error === "Account with this email already exists.") {
                        return setError("Account with this email already exists.");
                    }
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

    const handleAppleRegister = async () => {
        setLoader(true); // Show loader
        try {
            if (checkIfFiledIn() && checkIfAgreeTS()) {
                try {
                    // Call API to register business
                    const is_business = true;
                    const user = await AppleSignUp(
                        appleData,
                        is_business,
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
                    setError("");
                    controlStorage.set("businessIsLogedIn", true); // Set user as logged in
                    authStorage.set("accessToken", user.access);
                    authStorage.set("refreshToken", user.refresh);
                    saveBusinessMMKV(user.business); // Save business data
                    setLoginModal(false); // Close signup modal
                    router.navigate("homeBusiness");
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } catch (error) {
                    console.log(error);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    console.log(error.response.data);
                    if (error.response.data.error === "Account with this email already exists.") {
                        return setError("Account with this email already exists.");
                    }
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

    // Handle registration form submission
    const handleRegister = async () => {
        setLoader(true); // Show loader
        try {
            if (
                // validateEmail(email, setError) &&
                checkIfFiledIn() &&
                // checkPassword(password, repeatPassword, setError) &&
                checkIfAgreeTS()
            ) {
                try {
                    // Call API to register business
                    await BusinessResgister(
                        businessName,
                        email,
                        password,
                        repeatPassword,
                        selectedCategory,
                        postalCode,
                        streetNumber,
                        street,
                        city,
                        country,
                        lat,
                        lng,
                    );
                    // Authenticate business after registration
                    const data = await AuthenticateBusiness(email, password);
                    setError("");
                    controlStorage.set("businessIsLogedIn", true); // Set user as logged in
                    authStorage.set("accessToken", data.access);
                    authStorage.set("refreshToken", data.refresh);
                    saveBusinessMMKV(data.business); // Save business data
                    setLoginModal(false); // Close signup modal
                    router.navigate("homeBusiness");
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } catch (error) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    console.log(error.response.data);
                    if (error.response.data === "A business user with this email already exists.") {
                        return setError("A business user with this email already exists.");
                    }
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
        // <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : "padding"} className="flex flex-1">
        <>
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
            <ScrollView nestedScrollEnabled={true} className="h-screen w-screen p-6 flex-1">
                {/*<Pressable className={"justify-center items-center w-full h-screen"}>*/}
                <Animated.View style={animatedStyle} className="w-full mt-14 max-w-[600]">
                    <View className="w-full items-center mb-12">
                        <UGEM width={200} height={36} fill={colors.zest["400"]}/>
                    </View>
                    {/*<View className="">*/}
                    {/*    <Text className="pb-4 mb-4 text-center  text-xl font-semibold">*/}
                    {/*        Sign Up*/}
                    {/*    </Text>*/}
                    {/*</View>*/}
                    <View className="mb-6 w-full">
                        <TextInput
                            style={{borderColor: colors["ship-gray"]["200"]}}
                            className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white"
                            inputMode={"email"}
                            onChangeText={(text) => setBusinessName(text)}
                        />
                        <Text
                            className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Business
                            Name</Text>
                    </View>
                    <View className="w-full">
                        {/*<Pressable>*/}
                        <DropdownComponent
                            itemList={categoryList}
                            setSelectedItem={setSelectedCategory}
                            selectedItem={selectedCategory}
                            label={"Business categories"}
                        />
                        {/*</Pressable>*/}
                    </View>
                    {/* Address selection button */}
                    <View className="mb-4 w-full">
                        {/*<View style={styles.shadow} className="w-full bg-white rounded-xl">*/}
                        <View className="text-xl border p-3 py-5 border-ship-gray-200 rounded-lg bg-white">
                            <Pressable
                                onPress={() => setIsAddress(true)}
                                className="text-xl border p-3 py-5 border-ship-gray-200 rounded-lg bg-white">
                                <Text className=" text-lg">
                                    {streetNumber ? (
                                        `${country}, ${city}, ${street} ${streetNumber}`
                                    ) : (
                                        <Text className="text-[#C0C0C0] text-xl">Select address</Text>
                                    )}
                                </Text>
                            </Pressable>
                        </View>
                        <Text
                            className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Business
                            address</Text>
                        {/*</View>*/}
                    </View>
                    {error ? <Text className="text-center  w-full text-red-500 text-lg mb-1">{error}</Text> : null}
                    <View className="mt-2 flex-row justify-between w-full">
                        <View className="flex-shrink">
                            <Text className="text-base text-left">
                                I am 18 years of age or older and agree to the uGem
                                <Text onPress={() => Linking.openURL(`${MEDIA_URL}privacy-policy`)}
                                      className="text font-bold text-left">
                                    {" "}
                                    Privacy Policy{" "}
                                </Text>
                                and
                                <Text onPress={() => Linking.openURL(`${MEDIA_URL}terms-of-use`)}
                                      className="font-bold text">
                                    {" "}
                                    Terms of Service
                                </Text>
                                .
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                setIsSelected(!isSelected);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            }}>
                            <Checkbox size={24} isChecked={isSelected} color={colors["zest"]["500"]}></Checkbox>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        disabled={loader}
                        onPress={() => (googleData ? handleGoogleRegister() : appleData ? handleAppleRegister() : handleRegister())}
                        className="w-full rounded-lg bg-ship-gray-900 items-center justify-center mt-6">
                        {loader ? (
                            <View className="p-5">
                                <SaveLoader/>
                            </View>
                        ) : (
                            <Text className="text-center w-full p-5 text-white font-semibold text-xl">Sign Up</Text>
                        )}
                    </TouchableOpacity>
                    <View className="w-full mt-5 pr-3 pl-3">
                        <View className="w-full border-b border-b-gray-100 "></View>
                    </View>
                    <TouchableOpacity className="mt-5 w-full items-center" onPress={() => scrollToPage(1)}>
                        <Text className="font-bold">
                            <Text className="text-gray-600 font-normal">go</Text> Back
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
                {/*</Pressable>*/}
            </ScrollView>
        </>
    );
};

export default SignUpBusiness;

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
