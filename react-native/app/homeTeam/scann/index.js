// import { Camera, CameraView } from "expo-camera";
import {useEffect, useRef, useState} from "react";
import {Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Haptics from "expo-haptics";
import {router} from "expo-router";
import Loader from "../../../components/smallComponents/loader";
import {controlStorage} from "../../../MMKV/control";

import {Camera, useCameraDevice, useCodeScanner} from "react-native-vision-camera";

import UGEM from "../../../assets/svg/uGem.svg";
import {colors} from "../../../constants/colors";
import {VerifyCustomer} from "../../../axios/axiosBusiness/customerCard";
import {authStorage} from "../../../MMKV/auth";
import {GetVoucher} from "../../../axios/axiosTeams/voucher";
import {saveCurrentVoucherMMKV} from "../../../MMKV/mmkvCustomer/vouchers";
import {getTeamProfileMMKV} from "../../../MMKV/mmkvTeams";

export default function SannTeam() {
    const [scanned, setScanned] = useState(false);

    const scannedRef = useRef(false); // Create a ref to keep track of scanned state
    const [isActive, setIsActive] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(Camera.requestCameraPermission());
    const device = useCameraDevice("back");

    const token = authStorage.getString("accessToken");

    const teamProfile = getTeamProfileMMKV();

    useEffect(() => {
        if (device) {
            setIsActive(true);
        }
    }, [device]);

    const askPermission = async () => {
        const newCameraPermission = await Camera.requestCameraPermission();
        setCameraPermission(newCameraPermission);
        return newCameraPermission;
    };

    // const permission = Camera.getCameraPermissionStatus();

    const codeScanner = useCodeScanner({
        codeTypes: ["qr", "ean-13"],
        onCodeScanned: (codes) => {
            if (!scannedRef.current) {
                // Check ref instead of state
                scannedRef.current = true; // Update ref immediately
                setIsActive(false);
                handleQrScan(codes[0].value);
            }
        },
    });

    const handleQrScan = async (data) => {
        if (data.startsWith("https://ugem.app/")) {
            // controlStorage.set("scannedCardQr", data);
            // router.navigate(`homeTeam/scann/onCardScanned`);
            // setIsScan(false);
            try {
                const jwtToken = data.split("/").pop();
                const getSecretKey = await VerifyCustomer(jwtToken, token);
                router.dismiss()
                router.push({
                    pathname: `/homeTeam/scann/onCardScanned/success`,
                    params: {secretKey: getSecretKey.secret_key}
                })
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
                router.dismiss()
                router.push(`/homeTeam/scann/onCardScanned/failure`)
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        } else {
            // controlStorage.set("scannedVoucherQr", data);
            // router.navigate(`homeTeam/scann/onVoucherScanned`);
            // setIsScan(false);
            try {
                const response = await GetVoucher(data, teamProfile.user_id, token);
                saveCurrentVoucherMMKV(response)
                controlStorage.set("scannedVoucherQr", data);
                router.dismiss()
                router.push(`/homeTeam/scann/onVoucherScanned/exists`)
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
                router.dismiss()
                router.push(`/homeTeam/scann/onVoucherScanned/failure`)
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }
        setScanned(true);
    };

    if (!cameraPermission || cameraPermission === "denied") {
        // Camera permissions are not granted yet.
        return (
            <View className="items-center justify-center flex-1">
                <Text style={{textAlign: "center"}}>We need your permission to show the camera</Text>
                <Button onPress={askPermission} title="grant permission"/>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center">
            {isActive ? (
                <View className="flex-1 items-center justify-center">
                    <Camera style={StyleSheet.absoluteFill} device={device} isActive={isActive}
                            codeScanner={codeScanner}/>
                    <View className="border-2 w-60 h-60 rounded-xl border-zest-400 items-end">
                        <View className="w-[100%] h-56 justify-end items-end">
                            <UGEM width={60} height={14} fill={colors.zest["400"]}/>
                        </View>
                    </View>
                    <View className=" absolute bottom-0 h-28 bg-gray-100 w-full justify-center">
                        <View className="items-center justify-center w-full mb-4 mt-4">
                            <TouchableOpacity
                                onPress={() => {
                                    router.back()
                                    // setIsScan(false);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                }}

                                className="w-[90%] flex h-16 flex-col items-center justify-center rounded-lg bg-white border border-gray-800">
                                {/* <QR width={30} height={30} fill={"#444"} /> */}
                                <Text className="text-lg font-semibold">Go Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <View className="flex-1 items-center justify-center">
                    <Loader/>
                </View>
            )}
        </View>
    );
}
