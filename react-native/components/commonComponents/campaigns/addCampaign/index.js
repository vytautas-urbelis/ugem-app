import {Dimensions, StyleSheet, Text, TextInput, View} from "react-native";

import * as Haptics from "expo-haptics";
import {useState} from "react";
import {GetOpenCampaigns, postCampaign} from "../../../../axios/axiosBusiness/campaign";
import {saveCampaignsMMKV} from "../../../../MMKV/mmkvBusiness/campaigns";
import DatePickerCampaign from "./datePicker";
import {authStorage} from "../../../../MMKV/auth";
import {Entypo} from "@expo/vector-icons";
import {colors} from "../../../../constants/colors";
import {checkIfFilledIn} from "../../../../utils/auth";
import SaveLoader from "../../../smallComponents/smLoader";
import {BaseButton, Pressable, ScrollView} from "react-native-gesture-handler";
import StampPicker from "./stampPicker";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../../MMKV/control";
import {router} from "expo-router";

const AddCampaign = () => {
    const [image, setImage] = useState(null);
    const [collectorType, setCollectorType] = useState(1);
    const [campaignName, setCampaignName] = useState("");
    const [selectedStamp, setSelectedStamp] = useState(1);
    const [description, setDescription] = useState("");

    const [additionalInfo, setAdditionalInfo] = useState("");
    const [campaignGoal, setCampaignGoal] = useState(6);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(() => {
        const currentDate = new Date(); // Get the current date
        const nextYearDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)); // Set the date to one year from now
        return nextYearDate;
    });

    const [isSaving, setIsSaving] = useState(false);

    const accessToken = authStorage.getString("accessToken");

    const [refreshBusinessFeed, setRefreshBusinessFeed] = useMMKVBoolean("refreshBusinessFeed", controlStorage);

    // Colors change when not all inputs filled in
    const [campaignBorderColor, setCampaignBorderColor] = useState(true);
    const [descriptionBorderColor, setDescriptionBorderColor] = useState(true);

    const createCampaign = async () => {
        setIsSaving(true);
        // Check if all fields filled in
        if (!checkIfFilledIn(campaignName, setCampaignBorderColor, description, setDescriptionBorderColor)) {
            setIsSaving(false);
            return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        const starts = startDate.toISOString().slice(0, 10);
        const ends = endDate.toISOString().slice(0, 10);

        const formData = new FormData();

        formData.append("name", campaignName);
        formData.append("description", description);
        formData.append("additional_information", additionalInfo);
        formData.append("value_goal", campaignGoal);
        formData.append("collector_type", collectorType);
        formData.append("beginning_date", starts);
        formData.append("ending_date", ends);
        if (collectorType === 1) {
            formData.append("stamp_design", selectedStamp);
        }

        if (image) {
            formData.append("logo", {
                uri: image.uri,
                name: image.fileName || "image.jpg", // Provide a default name if none exists
                type: image.mimeType || "image/jpeg", // Provide a default type if none exists
            });
        }

        try {
            await postCampaign(accessToken, formData);
            const campaigns = await GetOpenCampaigns(accessToken);
            saveCampaignsMMKV("openCampaigns", campaigns);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // onRefresh();
            setRefreshBusinessFeed(!refreshBusinessFeed);
            // setIsAddCampaign(false);
            router.back()
        } catch (error) {
            console.log(error)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsSaving(false);
        }
    };

    // // Function to resize and compress image
    // const manipulateImage = async (image) => {
    //   const manipResult = await ImageManipulator.manipulateAsync(
    //     image.uri,
    //     [{ resize: { width: 1000 } }], // Resize the image to a width of 1000px (adjust as necessary)
    //     { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }, // Compress the image to 60% quality
    //   );
    //   return manipResult;
    // };

    // const takeImage = async () => {
    //   const { status } = await ImagePicker.requestCameraPermissionsAsync();
    //   if (status !== "granted") {
    //     alert("Sorry, we need camera permissions to make this work!");
    //   }

    //   let result = await ImagePicker.launchCameraAsync({
    //     allowsEditing: true,
    //     aspect: [4, 4],
    //     quality: 1, // Set quality to 1 to get the best quality image
    //   });

    //   if (!result.canceled) {
    //     const resizedImage = await manipulateImage(result.assets[0]); // Resize and compress the image
    //     setImage(resizedImage); // Set the resized image
    //   }
    // };

    // const pickImage = async () => {
    //   let result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.All,
    //     allowsEditing: true,
    //     aspect: [4, 4],
    //     quality: 1, // Set quality to 1 to get the best quality image
    //   });

    //   if (!result.canceled) {
    //     const resizedImage = await manipulateImage(result.assets[0]); // Resize and compress the image
    //     setImage(resizedImage); // Set the resized image
    //   }
    // };

    const onEndDateChange = (date) => {
        if (date <= new Date()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setEndDate(new Date());
            return alert("You can choose only future date!");
        }
        setEndDate(date);
    };

    const renderRoundObjects = () => {
        let roundObjects = [];
        for (let i = 0; i < campaignGoal; i++) {
            roundObjects.push(<View
                className=" h-[16] w-[16] bg-shamrock-100 rounded-full m-1 items-center justify-center"
                key={i}></View>);
        }
        return roundObjects;
    };

    const renderRoundObjectsUnactive = () => {
        let roundObjects = [];
        for (let i = 0; i < 6; i++) {
            roundObjects.push(<View
                className=" h-[16] w-[16] bg-ship-gray-100 rounded-full m-1 items-center justify-center"
                key={i}></View>);
        }
        return roundObjects;
    };

    return (
        // <GestureHandlerRootView>
        <ScrollView nestedScroll={true} className="h-full bg-white">
            {/* <TouchableOpacity activeOpacity={0.99}> */}
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
                <View className="bg-green-50 rounded-lg border border-green-300 mb-4">
                    <View className={'p-3'}>
                        <Text className={'text-base text-ship-gray-900 '}>Create <Text
                            className={'font-bold'}>campaigns</Text> for your customers to collect points or earn stamps
                            with various designs and amounts. Once a customer completes a full card, they will receive a
                            campaign <Text className={'font-bold'}>voucher</Text> as a reward.</Text>
                    </View>
                </View>
                <View className="mb-4">
                    <Text className=" mt-2 ml-4 text-shamrock-700 w-full text-left text-lg mb-1">Short campaign name
                        *</Text>
                    <TextInput
                        style={{borderColor: campaignBorderColor ? colors["ship-gray"]["200"] : "red"}}
                        className="text-xl border p-3 border-ship-gray-200 rounded-lg bg-ship-gray-100"
                        value={campaignName}
                        placeholder={'e.g. Free coffee'}
                        onChangeText={(text) => setCampaignName(text)}
                    />
                </View>
                <View className="mb-4">
                    <Text className=" mt-2 ml-4  text-shamrock-700 w-full text-left text-lg mb-1">Description
                        *</Text>
                    <TextInput
                        style={{borderColor: descriptionBorderColor ? colors["ship-gray"]["200"] : "red"}}
                        multiline={true}
                        numberOfLines={4}
                        className="text-xl border p-3 h-24 border-ship-gray-200 rounded-lg bg-ship-gray-100"
                        value={description}
                        placeholder={'e.g. Collect 9 stamps to enjoy a free coffee!'}
                        onChangeText={(text) => setDescription(text)}
                    />
                </View>

                <View className="mb-6">
                    <Text className=" mt-2 ml-4 text-shamrock-700 w-full text-left text-lg mb-1">Additional
                        information on voucher</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        className="text-xl border p-3 h-24 border-ship-gray-200 rounded-lg bg-ship-gray-100"
                        value={additionalInfo}
                        placeholder={"e.g. This voucher can only be used within the app."}
                        onChangeText={(text) => setAdditionalInfo(text)}
                    />
                </View>

                <View className="justify-between">
                    <View className=" flex-row justify-between">
                        {collectorType === 1 ? (
                            <View style={styles.shadow} className="w-[46%] mt-1">
                                <View
                                    className={` h-56 items-center bg-shamrock-300 rounded-lg w-full justify-between`}>
                                    <View>
                                        <Text
                                            className={`text-center text-2xl font-semibold text-shamrock-700 mt-2 mb-1`}>Stamps</Text>
                                        <View className=" flex-row w-[70] flex-wrap">{renderRoundObjects()}</View>
                                    </View>

                                    <View className="flex-row w-full justify-center">
                                        {campaignGoal === 6 ? (
                                            <View className="w-16 h-16 items-center justify-start">
                                                <Entypo name="minus" size={40} color={colors["shamrock"]["200"]}/>
                                            </View>
                                        ) : (
                                            <View className="w-16 h-16 items-center justify-start">
                                                <Pressable
                                                    onPress={() => {
                                                        setCampaignGoal(campaignGoal - 3);
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                                    }}
                                                    className="w-16 h-16 items-center justify-start">
                                                    <Entypo name="minus" size={40} color="#292524"/>
                                                </Pressable>
                                            </View>
                                        )}
                                        <View className="w-8 items-center">
                                            <Text
                                                className="text-center text-lg font-semibold text-shamrock-600 mt-1">{campaignGoal}</Text>
                                        </View>
                                        {campaignGoal === 15 ? (
                                            <View className="w-16 h-16 items-center justify-start">
                                                <Entypo name="plus" size={40} color={colors["shamrock"]["200"]}/>
                                            </View>
                                        ) : (
                                            <View className="w-16 h-16 items-center justify-start">
                                                <Pressable
                                                    onPress={() => {
                                                        setCampaignGoal(campaignGoal + 3);
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
                        ) : (
                            <View className="w-[46%] mt-1">
                                <Pressable
                                    onPress={() => {
                                        setCampaignGoal(6);
                                        setCollectorType(1);
                                        setSelectedStamp(1);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    }}
                                >
                                    <View className="w-full mt-1">
                                        <View
                                            className={` h-56 items-center bg-white border border-ship-gray-100 justify-between rounded-lg`}>
                                            <View>
                                                <Text
                                                    className={`text-center text-2xl font-semibold text-ship-gray-200 mt-2 mb-1`}>Stamps</Text>
                                                <View
                                                    className=" flex-row w-[70] flex-wrap">{renderRoundObjectsUnactive()}</View>
                                            </View>

                                            <View className="flex-row w-full justify-center">
                                                <View className="w-16 h-16 items-center justify-start">
                                                    <Entypo name="minus" size={40} color={colors["ship-gray"]["200"]}/>
                                                </View>

                                                <View className="w-8 items-center">
                                                    <Text
                                                        className="text-center text-lg font-semibold text-ship-gray-200 mt-1">6</Text>
                                                </View>

                                                <View className="w-16 h-16 items-center justify-start">
                                                    <Entypo name="plus" size={40} color={colors["ship-gray"]["200"]}/>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                </Pressable>
                            </View>
                        )}

                        {collectorType === 2 ? (
                            <View style={styles.shadow} className="w-[46%] mt-1">
                                <View className={` h-56 items-center bg-shamrock-300  justify-between rounded-lg`}>
                                    <Text
                                        className={`text-center text-2xl font-semibold text-shamrock-700 mt-2`}>Points</Text>
                                    <View className="h-12 w-full">
                                        <TextInput
                                            keyboardType="numeric"
                                            className="text-3xl text-center font-bold text-shamrock-700"
                                            value={String(campaignGoal)}
                                            onChangeText={(text) => setCampaignGoal(text)}
                                        />
                                    </View>

                                    <View className="flex-row w-full justify-center">
                                        {campaignGoal === 100 ? (
                                            <View className="w-16 h-16 items-center justify-start">
                                                <Entypo name="minus" size={40} color={colors["shamrock"]["200"]}/>
                                            </View>
                                        ) : (
                                            <View className="w-16 h-16 items-center justify-start">
                                                <Pressable
                                                    onPress={() => {
                                                        setCampaignGoal(parseFloat(campaignGoal) - 10);
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                                    }}
                                                    className="w-16 h-16 items-center justify-start">
                                                    <Entypo name="minus" size={40} color="#292524"/>
                                                </Pressable>
                                            </View>
                                        )}
                                        <View className="w-8 items-center">
                                            <Text
                                                className="text-center text-lg font-semibold text-shamrock-600 mt-1"></Text>
                                        </View>
                                        {campaignGoal === 15 ? (
                                            <View className="w-16 h-16 items-center justify-start">
                                                <Entypo name="plus" size={40} color={colors["shamrock"]["200"]}/>
                                            </View>
                                        ) : (
                                            <View className="w-16 h-16 items-center justify-start">
                                                <Pressable
                                                    onPress={() => {
                                                        setCampaignGoal(parseFloat(campaignGoal) + 10);
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
                        ) : (
                            <View className="w-[46%] mt-1">
                                <Pressable
                                    onPress={() => {
                                        setCampaignGoal(100);
                                        setCollectorType(2);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    }}
                                >
                                    <View className="w-full mt-1">
                                        <View
                                            className={` h-56 items-center "bg-white border border-ship-gray-100 bg-white justify-between rounded-lg`}>
                                            <Text
                                                className={`text-center text-2xl font-semibold text-ship-gray-200  mt-2`}>Points</Text>
                                            <View className="h-12 w-full">
                                                <Text
                                                    className="text-3xl text-center font-bold text-ship-gray-200">100</Text>
                                            </View>

                                            <View className="flex-row w-full justify-center">
                                                <View className="w-16 h-16 items-center justify-start">
                                                    <Entypo name="minus" size={40} color={colors["ship-gray"]["200"]}/>
                                                </View>

                                                <View className="w-8 items-center">
                                                    <Text
                                                        className="text-center text-lg font-semibold text-shamrock-600 mt-1"></Text>
                                                </View>

                                                <View className="w-16 h-16 items-center justify-start">
                                                    <Entypo name="plus" size={40} color={colors["ship-gray"]["200"]}/>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>
                {collectorType === 1 &&
                    <StampPicker selectedStamp={selectedStamp}
                                 setSelectedStamp={setSelectedStamp}/>}

                <DatePickerCampaign date={endDate} onDateChange={onEndDateChange} label={"Campaign's end date"}/>

                <View className="border-b border-b-shamrock-100 mt-8"></View>

                <View className="mt-8 justify-between flex">
                    {/*<View className="w-full rounded-lg bg-shamrock-400  justify-center items-center">*/}
                    <BaseButton
                        disabled={isSaving}
                        style={styles.shadow}
                        onPress={createCampaign}
                    >
                        <View className="w-full rounded-lg bg-shamrock-400  justify-center items-center">
                            {isSaving ? (
                                <View className="p-5">
                                    <SaveLoader/>
                                </View>
                            ) : (
                                <Text className="text-center w-full p-5 text-white font-semibold text-xl">Create
                                    campaign</Text>
                            )}
                        </View>
                    </BaseButton>
                    {/*</View>*/}
                    {/*<TouchableOpacity*/}
                    {/*    onPress={() => router.back()}*/}
                    {/*    className="w-full rounded-lg bg-white border border-ship-gray-400 mt-8 mb-8">*/}
                    {/*    <Text className="text-center w-full p-5 text-ship-gray-600 text-xl">Cancel</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </View>
            {/* </TouchableOpacity> */}
        </ScrollView>
        // </GestureHandlerRootView>
    );
};

export default AddCampaign;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: colors.shamrock["700"],
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
