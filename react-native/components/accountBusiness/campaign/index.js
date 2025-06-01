import {Alert, Image, PermissionsAndroid, Platform, StyleSheet, Text, View} from "react-native";
import {useState} from "react";
import {authStorage} from "../../../MMKV/auth";
import {Pressable, ScrollView} from "react-native-gesture-handler";
import {router} from "expo-router";
import {Entypo, Feather, MaterialIcons} from "@expo/vector-icons";
import {colors} from "../../../constants/colors";
import {returnStamp} from "../../../utils/stamps";
import * as Haptics from "expo-haptics";
import {BottomModal, SlideAnimation} from "react-native-modals";
import ColorPickerComponent from "../../smallComponents/colorPicker";
import {editCampaign} from "../../../axios/axiosBusiness/campaign";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../MMKV/control";
import RNFetchBlob from "rn-fetch-blob";
import {CameraRoll} from "@react-native-camera-roll/camera-roll";

const CampaignView = ({campaign}) => {
    const accessToken = authStorage.getString("accessToken");

    // const [campaign, setCampaign] = useState(null);
    const [stampColor, setStampColor] = useState(campaign.color);
    const [stampsAmount, setStampsAmount] = useState(campaign.self_scann_amount);
    const [isSelectColor, setIsSelectColor] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // MMKV booleans for modals
    const [refreshBusinessFeed, setRefreshBusinessFeed] = useMMKVBoolean("refreshBusinessFeed", controlStorage);

    const saveToGallery = async (imgUrl) => {
        let newImgUri = imgUrl.lastIndexOf('/');
        let imageName = imgUrl.substring(newImgUri + 1); // Fix filename extraction
        let dirs = RNFetchBlob.fs.dirs;

        let iosPath = `${dirs.DocumentDir}/${imageName}`;
        let androidPath = `${dirs.DownloadDir}/${imageName}`;
        
        if (Platform.OS === 'android') {
            try {
                // ✅ Correct Permission Handling for Android 10+
                let granted;
                if (Platform.Version >= 33) { // Android 13+
                    granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                        {
                            title: "Storage Permission",
                            message: "App needs access to your storage to save images",
                            buttonPositive: "OK",
                            buttonNegative: "Cancel"
                        }
                    );
                } else if (Platform.Version >= 29) { // Android 10+
                    granted = PermissionsAndroid.RESULTS.GRANTED; // Scoped Storage does not need WRITE permission
                } else { // Android 9 and below
                    granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: "Storage Permission",
                            message: "App needs access to your storage to save images",
                            buttonPositive: "OK",
                            buttonNegative: "Cancel"
                        }
                    );
                }

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert("Storage permission denied");
                    return;
                }

                // ✅ Use the Android Download Manager to save the file
                RNFetchBlob.config({
                    fileCache: true,
                    appendExt: 'png',
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        path: androidPath,
                        description: 'Downloading image...',
                        mime: 'image/png',
                        mediaScannable: true,
                    }
                }).fetch("GET", imgUrl)
                    .then(res => Alert.alert("Successfully saved QR Code"))
                    .catch(err => Alert.alert("Download failed", err.message));

            } catch (err) {
                console.warn(err);
            }
        } else {
            RNFetchBlob.config({
                fileCache: true,
                appendExt: 'png',
                path: iosPath
            }).fetch("GET", imgUrl)
                .then(res => {
                    console.log("File saved at:", res.path());
                    CameraRoll.save(res.path(), {type: 'photo'})
                        .then(() => Alert.alert(`Successfully saved QR Code`))
                        .catch(err => Alert.alert("Save failed:", err));
                });
        }
    };


    const updateCampaign = async () => {
        setIsSaving(true);
        try {
            const response = await editCampaign(accessToken, {
                    color: stampColor,
                    self_scann_amount: stampsAmount
                },
                campaign.id)
            setRefreshBusinessFeed(!refreshBusinessFeed)
            router.back()
        } catch (e) {
            console.log(e);
        } finally {
            setIsSaving(false);
        }

    }


    const [imageLoad, setImageLoad] = useState(true);

    return (
        <>
            <View className={"h-screen"}>
                <View
                    className="w-full h-28 bg-ship-gray-50 justify-center items-center border-b border-b-ship-gray-200">

                    <View className="w-16 h-16 items-start justify-center absolute top-12 left-4">
                        <Pressable
                            onPress={() => {
                                router.back()
                            }}>
                            <Feather name="chevron-left" size={24} color={colors["ship-gray"]["800"]}/>
                        </Pressable>
                    </View>

                    <View className="mt-10">
                        <Text className="text-3xl font-bold text-normaltext">Campaign</Text>
                    </View>
                    <View className="w-16 h-16 items-start justify-center absolute top-12 right-4">
                        {isSaving ?
                            <Pressable><Text
                                className={"text-lg text-gray-300"}>Save</Text>
                            </Pressable> :
                            <Pressable onPress={updateCampaign}><Text
                                className={"text-lg text-blue-500"}>Save</Text>
                            </Pressable>}
                    </View>
                </View>
                <ScrollView className=" w-screen p-4 bg-white">
                    <View><Text className={"text-4xl font-semibold text-ship-gray-800"}>{campaign.name}</Text></View>
                    <View className={"mt-1 mb-6"}>
                        <Text className={"text-base font-semibold text-ship-gray-600"}>{campaign.description}</Text>
                    </View>
                    {campaign.collector_type.id === 1 ? <><Text className={`text-base mb-2`}>Select stamp color</Text>
                        <View
                            className={"flex flex-row items-center gap-5 bg-ship-gray-50 rounded-2xl justify-between p-2"}>
                            <View
                                className={"w-20 h-20 rounded-2xl bg-white"}>{returnStamp(stampColor, campaign.stamp_design, 70)}</View>
                            <View className={"flex flex-row items-center gap-1"}>
                                <Pressable onPress={() => {
                                    setIsSelectColor(true);
                                }}>
                                    <View style={{backgroundColor: stampColor}}
                                          className={`w-20 h-20 rounded-2xl`}></View>
                                    {/*<Text className={`text-xl`}>Color</Text>*/}
                                    {/*<MaterialCommunityIcons name="format-color-fill" size={20} color="black"/>*/}
                                </Pressable>


                            </View>
                        </View>
                        <Text className={`text-base mb-2 mt-6`}>Select stamps per customer scan</Text>
                        <View
                            className={"flex flex-row items-center gap-5 bg-ship-gray-50 rounded-2xl justify-between p-1"}>
                            <View className="flex-row w-full justify-end items-center">
                                {stampsAmount === 1 ? (
                                    <View className="w-16 h-12 items-center justify-start">
                                        <Entypo name="minus" size={40} color={colors["ship-gray"]["200"]}/>
                                    </View>
                                ) : (
                                    <View className="w-16 h-12 items-center justify-start">
                                        <Pressable
                                            onPress={() => {
                                                setStampsAmount(stampsAmount - 1);
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                            }}
                                            className="w-16 h-12 items-center justify-start">
                                            <Entypo name="minus" size={40} color="#292524"/>
                                        </Pressable>
                                    </View>
                                )}
                                <View className="w-16 items-center">
                                    <Text
                                        className="text-center text-4xl font-semibold text-ship-gray-700 mt-1">{stampsAmount}</Text>
                                </View>
                                {stampsAmount === campaign.value_goal ? (
                                    <View className="w-16 h-12 items-center justify-start">
                                        <Entypo name="plus" size={40} color={colors["ship-gray"]["200"]}/>
                                    </View>

                                ) : (
                                    <View className="w-16 h-12 items-center justify-start">
                                        <Pressable
                                            onPress={() => {
                                                setStampsAmount(stampsAmount + 1);
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                            }}
                                            className="w-16 h-12 items-center justify-start">
                                            <Entypo name="plus" size={40} color="#292524"/>
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        </View></> : <><Text className={`text-base mb-2 mt-6`}>Select stamps per customer scan</Text>
                        <View
                            className={"flex flex-row items-center gap-5 bg-ship-gray-50 rounded-2xl justify-between p-1"}>
                            <View className="flex-row w-full justify-end items-center">
                                {stampsAmount === 10 ? (
                                    <View className="w-16 h-12 items-center justify-start">
                                        <Entypo name="minus" size={40} color={colors["ship-gray"]["200"]}/>
                                    </View>
                                ) : (
                                    <View className="w-16 h-12 items-center justify-start">
                                        <Pressable
                                            onPress={() => {
                                                setStampsAmount(stampsAmount - 10);
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                            }}
                                            className="w-16 h-12 items-center justify-start">
                                            <Entypo name="minus" size={40} color="#292524"/>
                                        </Pressable>
                                    </View>
                                )}
                                <View className="min-w-16 items-center">
                                    <Text
                                        className="text-center text-4xl font-semibold text-ship-gray-700 mt-1">{stampsAmount}</Text>
                                </View>
                                {stampsAmount === campaign.value_goal ? (
                                    <View className="w-16 h-12 items-center justify-start">
                                        <Entypo name="plus" size={40} color={colors["ship-gray"]["200"]}/>
                                    </View>

                                ) : (
                                    <View className="w-16 h-12 items-center justify-start">
                                        <Pressable
                                            onPress={() => {
                                                setStampsAmount(stampsAmount + 10);
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                            }}
                                            className="w-16 h-12 items-center justify-start">
                                            <Entypo name="plus" size={40} color="#292524"/>
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        </View></>}

                    <Text className={`text-base mb-2 mt-6`}>Your campaign QR Code</Text>
                    <View
                        className={"items-center bg-ship-gray-50 rounded-2xl justify-center py-10 mb-10"}>
                        <Pressable onLongPress={() => {
                            console.log("long press")
                            // saveToGallery(campaign.qr_code)
                        }}>
                            <Image
                                source={{uri: `${campaign.qr_code}`}}
                                className="w-72 h-[280] mt-2 rounded-sm"
                                alt="qr code"

                            />
                        </Pressable>
                        <Pressable onPress={() => saveToGallery(campaign.qr_code)}>
                            <View className="mt-8">
                                <MaterialIcons name="download" size={44} color={colors["ship-gray"]["600"]}/>
                            </View>

                        </Pressable>
                    </View>

                </ScrollView>
            </View>
            <BottomModal
                style={{zIndex: 10}}
                visible={isSelectColor}
                onTouchOutside={() => setIsSelectColor(false)}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <ColorPickerComponent value={stampColor} setColor={setStampColor} setIsSelectColor={setIsSelectColor}/>
            </BottomModal>
        </>
    );
};

export default CampaignView;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 7.84,
        elevation: 10,
    },
});
