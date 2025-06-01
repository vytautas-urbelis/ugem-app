import { MMKV } from "react-native-mmkv";

export const userStorage = new MMKV({
  id: `user`,
});

export const saveCustomerMMKV = (array) => {
  try {
    const jsonString = JSON.stringify(array);
    userStorage.set("customer", jsonString);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const getCustomerMMKV = () => {
  try {
    const jsonString = userStorage.getString("customer");
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
};
