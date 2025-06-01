import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import SaveLoader from "../../smallComponents/smLoader";

export default function ConfirmDeleteMessage({ setIsDeleteMessage, deleteMessage }) {
  // State to manage loading indicator
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View className="flex w-full rounded-2xl h-40 justify-center items-center bg-white">
      {isLoading ? (
        // Show loader while logout process is ongoing
        <SaveLoader />
      ) : (
        <>
          {/* Logout confirmation message */}
          <Text className="text-normaltext text-base">Do you really want to delete this message?</Text>
          <View className="flex w-full items-center justify-center flex-row">
            {/* Log out button */}
            <TouchableOpacity
              style={styles.button} // Button style applied here
              onPress={deleteMessage} // Call delete function on press
            >
              <View style={styles.shadow}>
                <Text className="w-full text-base text-center">Delete</Text>
              </View>
            </TouchableOpacity>

            {/* Cancel button */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]} // Apply button and cancel button styles
              onPress={() => {
                setIsDeleteMessage(false); // Close logout modal on cancel
              }}>
              <View style={styles.shadow}>
                <Text className="w-full text-base text-center">Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  // Shadow style for button containers
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20.84,
    elevation: 10,
  },
  // Base button style
  button: {
    width: "33%", // 1/3 of the container width
    borderColor: "#4B5563", // Equivalent to border-zinc-700
    margin: 12, // Margin equivalent to m-3
    padding: 12, // Padding equivalent to p-3
    height: 64, // Height equivalent to h-16
    alignItems: "center", // Align items to center
    justifyContent: "center", // Justify content to center
    borderWidth: 1, // Border width of 1
    borderRadius: 12, // Border radius for rounded corners
  },
  // Additional style for cancel button
  cancelButton: {
    width: "50%", // 1/2 of the container width
  },
});
