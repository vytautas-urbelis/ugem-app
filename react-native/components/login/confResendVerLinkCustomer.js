import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import SaveLoader from "../smallComponents/smLoader";
import {authStorage} from "../../MMKV/auth";
import {SendVerificationEmail} from "../../axios/axiosCustomer/customerAuth";
import {router} from "expo-router";

export default function CustomerConfSendVerLink({setIsSendVerLink, setVerifyUserModal, setLoading}) {
    // State to manage loading indicator
    const [isLoading, setIsLoading] = useState(false);
    // Retrieve access token from local storage
    const accessToken = authStorage.getString("accessToken");

    // Send QR code email when component mounts
    useEffect(() => {
        const sendVerLink = async () => {
            setIsLoading(true); // Show loading indicatorsetVerifyUserModal
            // Function to handle sending a verification email
            try {
                await SendVerificationEmail(accessToken);
            } catch (error) {
                alert("Something went wrong.");
            } finally {
                setIsLoading(false); // Hide loading indicator
                setLoading(false)
            }

        };
        sendVerLink();
    }, []);

    return (
        <>
            {isLoading ? (
                // Display loader while QR code is being sent
                <View className="flex h-44 w-full rounded-2xl justify-center items-center bg-white">
                    <SaveLoader/>
                </View>
            ) : (
                // Display success message after QR code is sent
                <View className="flex h-44 w-full rounded-2xl justify-center items-center bg-white p-4">
                    <Text>The verification link has been sent to your email.</Text>
                    <View className="flex w-full h-16 items-center justify-center flex-row">
                        <TouchableOpacity
                            className="w-full h-16 rounded-lg mt-10 mb-6 items-center justify-center border border-ship-gray-800"
                            onPress={() => {
                                setVerifyUserModal(false)
                                setIsSendVerLink(false); // Close the modal on button press
                                router.navigate("homeCustomer");
                            }}>
                            <View>
                                <Text className="w-full font-semibold text-xl text-center">Close</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </>
    );
}

// Styles
const styles = StyleSheet.create({
    // Shadow style for the close button
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 2, height: 6},
        shadowOpacity: 0.3,
        shadowRadius: 20.84,
        elevation: 10,
    },
    // Button styling
    button: {
        width: "66%", // 2/3 of the width
        borderColor: "#4B5563", // Equivalent to text-gray-700
        margin: 12, // Margin equivalent to m-3
        padding: 12, // Padding equivalent to p-3
        height: 64, // Height equivalent to h-16
        alignItems: "center", // Align items to center
        justifyContent: "center", // Justify content to center
        borderWidth: 1, // Border width of 1
        borderRadius: 12, // Border radius for rounded corners
    },
});
