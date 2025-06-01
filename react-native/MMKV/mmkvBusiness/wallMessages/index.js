import { MMKV } from "react-native-mmkv";

export const wallMessagesStorage = new MMKV({
  id: `wallMessages`,
});

export const saveWallMessages = (array) => {
  try {
    const jsonString = JSON.stringify(array);
    wallMessagesStorage.set("messages", jsonString);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const getWallMessages = () => {
  try {
    const jsonString = wallMessagesStorage.getString("messages");
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
};
