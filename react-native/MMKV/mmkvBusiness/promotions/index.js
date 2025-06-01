import { MMKV } from "react-native-mmkv";

export const promotionsStorage = new MMKV({
  id: `deals`,
});

promotionsStorage.set("openPromotions", "");
promotionsStorage.set("closedPromotions", "");

export const saveMyPromotionsMMKV = (key, array) => {
  try {
    const jsonString = JSON.stringify(array);
    promotionsStorage.set(key, jsonString);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const getMyPromotionsMMKV = (key) => {
  try {
    const jsonString = promotionsStorage.getString(key);
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
};
