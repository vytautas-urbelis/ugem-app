
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ConfirmDeletion({ setIsConfirmDelete, OnDeletionConfirmed }) {
  return (
    <View className="flex w-full rounded-2xl h-60 justify-center items-center bg-white">
      {/* Warning Message */}
      <Text className="text-center text-lg pl-6 pr-6 pb-2">
        Do you really want to delete your account?
      </Text>
      
      {/* Additional Warning about Data Loss */}
      <Text className="text-red-500 text-center text-xs pl-6 pr-6 pb-2">
        It won't be possible to retrieve your deleted account.
      </Text>

      {/* Action Buttons */}
      <View className="flex w-full items-center justify-center flex-row">
        {/* Confirm Deletion Button */}
        <TouchableOpacity
          className="w-1/3 border-red-600 m-3 p-3 h-16 items-center justify-center border rounded-xl"
          onPress={OnDeletionConfirmed} // Call the function passed as a prop to confirm deletion
        >
          <View style={styles.shadow}>
            <Text className="w-full text-red-600 text-base text-center">Delete</Text>
          </View>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          className="w-1/2 border-zinc-700 m-3 p-3 h-16 items-center justify-center border rounded-xl"
          onPress={() => setIsConfirmDelete(false)} // Close the confirmation modal on cancel
        >
          <View style={styles.shadow}>
            <Text className="w-full text-base text-center">Cancel</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles for the shadow effect
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20.84,
    elevation: 10,
  },
});
