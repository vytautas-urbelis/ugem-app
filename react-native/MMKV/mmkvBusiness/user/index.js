import { MMKV } from "react-native-mmkv";

export const businessUserStorage = new MMKV({
  id: `businessUser`,
});

export const saveBusinessMMKV = (array) => {
  try {
    const jsonString = JSON.stringify(array);
    businessUserStorage.set("business", jsonString);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const getBusinessMMKV = () => {
  try {
    const jsonString = businessUserStorage.getString("business");
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
};
