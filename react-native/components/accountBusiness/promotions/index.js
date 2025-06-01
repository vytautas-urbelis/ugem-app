import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useEffect, useState } from "react"; // Import React hooks

// Importing API calls and local storage functions for messages
import SaveLoader from "../../smallComponents/smLoader";

// Importing custom components
import { GetOpenPromotions } from "../../../axios/axiosBusiness/promotions";
import { getMyPromotionsMMKV, saveMyPromotionsMMKV } from "../../../MMKV/mmkvBusiness/promotions";
import PromotionInAccount from "./promotion";
import { authStorage } from "../../../MMKV/auth";

export default function PromotionsSection({onRefresh}) {
  // User and business information
  const accessToken = authStorage.getString("accessToken");
  const openPromotions = getMyPromotionsMMKV('openPromotions') ? getMyPromotionsMMKV('openPromotions') : [];

  // State variables
  const [isLoading, setIsLoading] = useState(true); // Loading state for saving message

  // Fetch campaigns on component mount

  useEffect(() => {
    setIsLoading(true);
    const getPromotions = async () => {
      try {
        const promotions = await GetOpenPromotions(accessToken); // Fetch wall messages
        saveMyPromotionsMMKV('openPromotions', promotions); // Save campaigns locally
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    };

    getPromotions();
  }, []);

  // UI Component rendering
  return (
    <>
      {isLoading ? (
        <View className="h-screen"></View>
      ) : (
        <>
          {openPromotions.length !== 0 && (
            <View className="w-full flex-1 mt-6 mb-2">

              <View className="h-full">
                {openPromotions.map((promotion, index) => (
                  <PromotionInAccount key={promotion.id} promotion={promotion} index={index} onRefresh={onRefresh}/>
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,
    elevation: 2,
  },
  photoHeight: {
    height: Dimensions.get("window").width * 0.45,
  },
});
