import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import SaveLoader from "../../../smallComponents/smLoader";
import { editCampaign } from "../../../../axios/axiosBusiness/campaign";
import { authStorage } from "../../../../MMKV/auth";

export default function EndCampaign({ setIsEndCampaign, campaign, onRefresh }) {
  // State to manage loading indicator
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = authStorage.getString("accessToken");

  // Function to handle logout process
  const endCampaign = async () => {
    setIsLoading(true); // Show loading indicator

    // Simulate a logout process with a timeout
    const closeCampaign = async () => {
      try {
        const result = await editCampaign(accessToken, { is_active: false }, campaign.id);
        console.log(result);
        onRefresh();
        setIsEndCampaign(false);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    // Close logout modal
    setTimeout(() => {
      closeCampaign();
    }, 500);
  };

  return (
    <View className="flex w-full rounded-2xl h-40 justify-center items-center bg-white">
      {isLoading ? (
        // Show loader while logout process is ongoing
        <SaveLoader />
      ) : (
        <>
          {/* Logout confirmation message */}
          <Text className="mb-3">Do you really want to close this campaign?</Text>
          <View className="flex w-full items-center justify-around flex-row">
            {/* Log out button */}
            <TouchableOpacity
            className="border rounded-lg w-[40%] "
              onPress={endCampaign} // Call logout function on press
            >
              <View>
                <Text className="w-full text-xl text-center py-4">Close campaign</Text>
              </View>
            </TouchableOpacity>

            {/* Cancel button */}
            <TouchableOpacity
            className="border rounded-lg w-[40%] "
              onPress={() => {
                setIsEndCampaign(false); // Close logout modal on cancel
              }}>
              <View style={styles.shadow}>
                <Text className="w-full text-xl text-center py-4">Cancel</Text>
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
});
