import {Dimensions, StyleSheet, Text, View} from "react-native";

import * as Haptics from "expo-haptics";
import {useState} from "react";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator"; // Import ImageManipulator
import {CreatePromotion, GetOpenPromotions} from "../../../../axios/axiosBusiness/promotions";
import {saveMyPromotionsMMKV} from "../../../../MMKV/mmkvBusiness/promotions";
import {authStorage} from "../../../../MMKV/auth";
import {colors} from "../../../../constants/colors";
import {Entypo} from "@expo/vector-icons";
import DatePickerPromotion from "./datePicker";
import {checkIfFilledIn} from "../../../../utils/auth";
import SaveLoader from "../../../smallComponents/smLoader";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../../MMKV/control";
import {router} from "expo-router";
import {Pressable, ScrollView, TextInput} from "react-native-gesture-handler";

const options = [
    {label: "Regular", value: 1},
    {label: "Gold", value: 2},
    {label: "Platinum", value: 3},
];

const AddPromotion = () => {
    const [image, setImage] = useState(null);
    const [cardType, setCardType] = useState(1);
    const [promotionName, setPromotionName] = useState("");
    const [promotionDescription, setPromotionDescription] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [vouchers, setVouchers] = useState(30);
    const [endDate, setEndDate] = useState(() => {
        const currentDate = new Date(); // Get the current date
        const nextYearDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)); // Set the date to one year from now
        return nextYearDate;
    });

    const [visibleKeyboard, setVisibleKeyboard] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const accessToken = authStorage.getString("accessToken");

    const [refreshBusinessFeed, setRefreshBusinessFeed] = useMMKVBoolean("refreshBusinessFeed", controlStorage);

    // Colors change when not all inputs filled in
    const [promotionBorderColor, setPromotionBorderColor] = useState(true);
    const [descriptionBorderColor, setDescriptionBorderColor] = useState(true);

    const createPromotion = async () => {
        setIsSaving(true);
        if (!checkIfFilledIn(promotionName, setPromotionBorderColor, promotionDescription, setDescriptionBorderColor)) {
            setIsSaving(false);
            return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        const ends = endDate.toISOString().slice(0, 10);

        const formData = new FormData();

        formData.append("name", promotionName);
        formData.append("description", promotionDescription);
        formData.append("additional_information", additionalInfo);
        formData.append("vouchers_amount", vouchers);
        // formData.append("card_type", cardType);
        formData.append("card_type", 1);
        formData.append("date_ends", ends);

        if (image) {
            formData.append("image", {
                uri: image.uri,
                name: image.fileName || "image.jpg", // Provide a default name if none exists
                type: image.mimeType || "image/jpeg", // Provide a default type if none exists
            });
        }

        try {
            await CreatePromotion(formData, accessToken);
            const getPromotions = await GetOpenPromotions(accessToken);
            saveMyPromotionsMMKV("openPromotions", getPromotions);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // onRefresh();
            setRefreshBusinessFeed(!refreshBusinessFeed);
            // setIsAddPromotion(false);
            router.back()
        } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            console.log(error);
        } finally {
            setIsSaving(false);
        }
    };

    // Function to resize and compress image
    const manipulateImage = async (image) => {
        const manipResult = await ImageManipulator.manipulateAsync(
            image.uri,
            [{resize: {width: 1000}}], // Resize the image to a width of 1000px (adjust as necessary)
            {compress: 0.6, format: ImageManipulator.SaveFormat.JPEG}, // Compress the image to 60% quality
        );
        return manipResult;
    };

    const takeImage = async () => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera permissions to make this work!");
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1, // Set quality to 1 to get the best quality image
        });

        if (!result.canceled) {
            const resizedImage = await manipulateImage(result.assets[0]); // Resize and compress the image
            setImage(resizedImage); // Set the resized image
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1, // Set quality to 1 to get the best quality image
        });

        if (!result.canceled) {
            const resizedImage = await manipulateImage(result.assets[0]); // Resize and compress the image
            setImage(resizedImage); // Set the resized image
        }
    };

    const onEndDateChange = (date) => {
        if (date <= new Date()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setEndDate(new Date());
            return alert("You can choose only future date!");
        }
        setEndDate(date);
    };

    return (
        <ScrollView keyboardShouldPersistTaps="handled" className="h-full bg-white">
            <View className=" ml-8 mr-8 mt-10 mb-16">
                <View className="justify-between flex-row">
                    <View className="items-center justify-start flex-row mb-2 relative w-full">
                        {/* <View style={styles.shadowGray} className="w-full">
                <Image source={image ? { uri: image.uri } : DEFAULT} className="w-full h-48 mt-1 rounded-lg " alt="qr code" />
              </View>

              <View className="absolute -bottom-5 right-20">
                <TouchableOpacity onPress={pickImage}>
                  <View
                    className={` bg-white p-3 w-12 h-12 items-center justify-center  rounded-full flex flex-row border border-gray-200`}>
                    <Foundation name="photo" size={20} color="black" />
                  </View>
                </TouchableOpacity>
              </View>
              <View className=" absolute -bottom-5 right-2">
                <TouchableOpacity onPress={takeImage}>
                  <View
                    className={` bg-white w-12 p-3 h-12 items-center justify-center   rounded-full flex flex-row border border-gray-200`}>
                    <FontAwesome5 name="camera" size={20} color="black" />
                  </View>
                </TouchableOpacity>
              </View> */}
                    </View>
                </View>
                <View className="bg-portage-50 rounded-lg border border-portage-300 mb-4">
                    <View className={'p-3'}>
                        <Text className={'text-base text-ship-gray-900 '}>Create <Text
                            className={'font-bold'}>promotion</Text> vouchers to attract potential customers.
                            These <Text className={'font-bold'}>vouchers</Text> can be claimed by customers who visit
                            your profile or follow you on their feed.</Text>
                    </View>
                </View>
                <View className="mb-4">
                    <Text className=" mt-2 ml-4 text-portage-700 w-full text-left text-lg mb-1">Promotion Name
                        *</Text>
                    <TextInput
                        style={{borderColor: promotionBorderColor ? colors["ship-gray"]["200"] : "red"}}
                        className="text-xl border p-3 border-ship-gray-200 rounded-lg bg-ship-gray-100"
                        value={promotionName}
                        placeholder={'e.g. 20% for apple pie.'}
                        onChangeText={(text) => setPromotionName(text)}
                    />
                </View>
                <View className="flex-row justify-between items-end mb-2">
                    <View className=" w-[60%]">
                        <Text className=" ml-4 text-portage-700 w-full text-left text-lg mb-1">Description *</Text>
                        <TextInput
                            style={{borderColor: descriptionBorderColor ? colors["ship-gray"]["200"] : "red"}}
                            className="text-xl border p-3 border-ship-gray-200 rounded-lg bg-ship-gray-100 h-36"
                            value={promotionDescription}
                            onChangeText={(text) => setPromotionDescription(text)}
                            multiline={true}
                            placeholder={'e.g. Grab a voucher and enjoy 20% off on Apple Pie!'}
                            numberOfLines={4}
                        />
                    </View>

                    <View style={styles.shadow}
                          className={` items-end bg-portage-300 h-36 justify-between rounded-lg mt-4 w-[36%]`}>
                        <View className="flex justify-between w-full">
                            <View className="items-center">
                                <Text className={`text-center text-lg  text-portage-100 mt-2`}>Amount of
                                    vouchers</Text>
                                <View className="h-8 w-full items-center justify-center">
                                    <TextInput
                                        keyboardType="numeric"
                                        className="text-2xl font-bold text-portage-50"
                                        value={String(vouchers)}
                                        onChangeText={(text) => setVouchers(text)}

                                    />
                                </View>
                            </View>

                            <View className="flex-row  justify-center items-center">
                                {vouchers === 5 ? (
                                    <View className="w-16 h-16 items-center justify-start">
                                        <Entypo name="minus" size={40} color={colors["portage"]["200"]}/>
                                    </View>
                                ) : (
                                    <View className="w-16 h-16 items-center justify-start">
                                        <Pressable
                                            onPress={() => {
                                                setVouchers(parseFloat(vouchers) - 5);
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                            }}
                                            className="w-16 h-16 items-center justify-start">
                                            <Entypo name="minus" size={40} color="#292524"/>
                                        </Pressable>
                                    </View>
                                )}
                                {vouchers === 1000 ? (
                                    <View className="w-16 h-16 items-center justify-start">
                                        <Entypo name="plus" size={40} color={colors["portage"]["200"]}/>
                                    </View>
                                ) : (
                                    <View className="w-16 h-16 items-center justify-start">
                                        <Pressable
                                            onPress={() => {
                                                setVouchers(parseFloat(vouchers) + 5);
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                            }}
                                            className="w-16 h-16 items-center justify-start">
                                            <Entypo name="plus" size={40} color="#292524"/>
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
                <View className=" w-full mt-2">
                    <Text className=" ml-4 text-portage-700 w-full text-left text-lg mb-1">Additional information on
                        voucher</Text>
                    <TextInput
                        className="text-xl border p-3 border-ship-gray-200 rounded-lg bg-ship-gray-100 h-24"
                        value={additionalInfo}
                        onChangeText={(text) => setAdditionalInfo(text)}
                        multiline={true}
                        numberOfLines={4}
                        placeholder={'e.g. One voucher per customer.'}
                    />
                </View>

                <DatePickerPromotion date={endDate} onDateChange={onEndDateChange} label={"Promotion's end date"}/>

                <View className="border-b border-b-portage-100 mt-8"></View>
                <View className="mt-8 justify-between flex">

                    <Pressable
                        disabled={isSaving}
                        style={styles.shadow}
                        onPress={createPromotion}>
                        <View className="w-full rounded-lg bg-portage-400 items-center justify-center">
                            {isSaving ? (
                                <View className="p-5 w-full">
                                    <SaveLoader/>
                                </View>
                            ) : (
                                <Text className="text-center w-full p-5 text-white font-semibold text-xl">Create
                                    Promotion</Text>
                            )}
                        </View>
                    </Pressable>

                    {/*<TouchableOpacity*/}
                    {/*    onPress={() => router.back()}*/}
                    {/*    className="w-full rounded-lg bg-white border border-ship-gray-600 mt-8 mb-8">*/}
                    {/*    <Text className="text-center w-full p-5 text-black text-xl">Cancel</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </View>
        </ScrollView>
    );
};

export default AddPromotion;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: colors.portage["700"],
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 2,
    },
    shadowGray: {
        shadowColor: colors["ship-gray"]["700"],
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 2,
    },

    photoHeight: {
        height: Dimensions.get("window").width * 0.45,
        width: Dimensions.get("window").width * 0.44,
    },
});
