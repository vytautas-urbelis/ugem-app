import {useEffect, useRef, useState} from "react";
import {Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Camera, useCameraDevice, useCodeScanner} from "react-native-vision-camera";
import Loader from "../../../../components/accountCustomer/loader";
import {GetBusinessOnScan} from "../../../../axios/axiosCustomer/followSubscribe";
import {getCustomerMMKV} from "../../../../MMKV/mmkvCustomer/user";
import * as Haptics from "expo-haptics";

import UGEM from "../../../../assets/svg/uGem.svg";
import {colors} from "../../../../constants/colors";
import {authStorage} from "../../../../MMKV/auth";
import STOP from "../../../../assets/svg/stop.svg";
import {router} from "expo-router";
import {GetReward} from "../../../../axios/axiosCustomer/reward";
import {saveCurrentCollectorMMKV} from "../../../../MMKV/mmkvCustomer/collectors";
import {saveCurrentVoucherMMKV} from "../../../../MMKV/mmkvCustomer/vouchers";

export default function Scan() {
    const scannedRef = useRef(false); // Create a ref to keep track of scanned state
    const [isActive, setIsActive] = useState(false);
    const [anError, setAnError] = useState(null);

    const [cameraPermission, setCameraPermission] = useState(Camera.requestCameraPermission());

    const customerUser = getCustomerMMKV() ? getCustomerMMKV() : null;
    const device = useCameraDevice("back");

    const accessToken = authStorage.getString("accessToken");

    useEffect(() => {
        if (device) {
            setIsActive(true);
        }
        return () => {
            setIsActive(false)
        }
    }, [device]);

    const askPermission = async () => {
        const newCameraPermission = await Camera.requestCameraPermission();
        setCameraPermission(newCameraPermission);
        return newCameraPermission;
    };

    const permission = Camera.getCameraPermissionStatus();

    if (!cameraPermission || cameraPermission === "denied") {
        // Camera permissions are not granted yet.
        return (
            <View className="items-center justify-center flex-1  w-screen">
                <Text style={{textAlign: "center"}}>We need your permission to show the camera</Text>
                <Button onPress={askPermission} title="grant permission"/>
            </View>
        );
    }

    const codeScanner = useCodeScanner({
        codeTypes: ["qr", "ean-13"],
        onCodeScanned: (codes) => {
            if (!scannedRef.current) {
                console.log(codes[0].value.split("/"))
                // Check ref instead of state
                scannedRef.current = true; // Update ref immediately
                setIsActive(false);
                handleQrScan(codes[0].value);
            }
        },
    });

    const handleQrScan = (url) => {
        if (url.split("/")[3] === "get-started") {
            const business_qr = url.split("/").pop();
            return handleBusinessQR(business_qr);
        } else if (url.split("?")[1].startsWith("code")) {
            const extractedParameter = extractDataFromURL(url)
            return handleCampaignQR(extractedParameter)
        }

    }

    const extractDataFromURL = (url) => {
        // For example, you can use URLSearchParams to parse query parameters
        const params = new URLSearchParams(url.split('?')[1]);
        return Object.fromEntries(params.entries());
    };


    const handleBusinessQR = async (business_qr) => {
        try {
            const response = await GetBusinessOnScan(business_qr, accessToken);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.dismiss()
            router.push({
                pathname: `/homeCustomer/businessProfile/${response.business_id}`,
                params: {businessID: response.business_id}
            })
        } catch (error) {
            setAnError(error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleCampaignQR = async (parameter) => {
        try {
            console.log(parameter.code);
            const response = await GetReward(accessToken, parameter.code);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.dismiss()
            if (response.type === "collector") {
                console.log(response.collector)
                saveCurrentCollectorMMKV(response.collector);
                router.push("homeCustomer/cardsView/collector")
            }
            if (response.type === "voucher") {
                console.log(response.voucher)
                saveCurrentVoucherMMKV(response.voucher);
                router.push("homeCustomer/cardsView/voucher")
            }
        } catch (error) {
            setAnError(error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    return (
        <View className="flex-1 justify-center w-screen">
            {isActive ? (
                <View className="flex-1 items-center justify-center">
                    <Camera style={StyleSheet.absoluteFill} device={device} isActive={isActive}
                            codeScanner={codeScanner}/>
                    <View className="border-2 w-60 h-60 rounded-xl border-zest-400 items-end">
                        <View className="w-[100%] h-56 justify-end items-end">
                            <UGEM width={60} height={14} fill={colors.zest["400"]}/>
                        </View>
                    </View>
                </View>
            ) : (
                <>
                    {anError ? (
                        <View className="flex-1 items-center justify-center bg-white">
                            <View className="w-[100%] justify-center items-center">
                                <STOP width={300} height={300} fill={colors.zest["400"]}/>
                            </View>
                            <View className="w-[100%] h-16 justify-center items-center">
                                <Text className={'text-3xl font-semibold'}>Wrong QR code :(</Text>
                            </View>
                        </View>
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Loader/>
                        </View>
                    )}
                </>
            )}
            {/* <TouchableOpacity className="w-full items-center justify-center h-20" onPress={closeCamera}>
        <Text>close</Text>
      </TouchableOpacity> */}
            <View className="items-center justify-center w-full mb-4 mt-4">
                <TouchableOpacity
                    onPress={() => {
                        router.back()
                        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                    }}

                    className="w-[90%] flex h-16 flex-col items-center justify-center rounded-lg bg-white border border-gray-800">
                    {/* <QR width={30} height={30} fill={"#444"} /> */}
                    <Text className="text-lg font-semibold">Go Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
