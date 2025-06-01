
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import SaveLoader from "../../smallComponents/smLoader";
import { SendBusinessQr } from "../../../axios/axiosBusiness/businessAuth";
import * as Haptics from "expo-haptics";
import { authStorage } from "../../../MMKV/auth";

export default function ConfSendQr({ setIsSendQr }) {
  // State to manage loading indicator
  const [isLoading, setIsLoading] = useState(false);
  // Retrieve access token from local storage
  const accessToken = authStorage.getString("accessToken");

  // Send QR code email when component mounts
  useEffect(() => {
    const sendQr = async () => {
      setIsLoading(true); // Show loading indicator
      try {
        await SendBusinessQr(accessToken); // Send QR code to user's email
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Provide haptic feedback on success
      } catch (error) {
        console.log(error);
        alert("QR code was not sent"); // Alert if there is an error
        setIsSendQr(false); // Close modal if there is an error
      } finally {
        setIsLoading(false); // Hide loading indicator
      }
    };

    sendQr();
  }, []);

  return (
    <>
      {isLoading ? (
        // Display loader while QR code is being sent
        <View className="flex h-40 w-full rounded-2xl justify-center items-center bg-white">
          <SaveLoader />
        </View>
      ) : (
        // Display success message after QR code is sent
        <View className="flex h-40 w-full rounded-2xl justify-center items-center bg-white">
          <Text>QR code was sent to your email.</Text>
          <View className="flex w-full items-center justify-center flex-row">
            <TouchableOpacity
              style={styles.button} // Applied styles for button
              onPress={() => {
                setIsSendQr(false); // Close the modal on button press
              }}>
              <View style={styles.shadow}>
                <Text className="w-full text-base text-center">Close</Text>
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
    shadowOffset: { width: 2, height: 6 },
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
