import { MMKV } from "react-native-mmkv";

export const controlStorage = new MMKV({
  id: `control`,
});

export const saveColorPaletteMMKV = (array, color) => {
  try {
    const jsonString = JSON.stringify(array);
    controlStorage.set(color, jsonString);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const getColorPaletteMMKV = (color) => {
  try {
    const jsonString = controlStorage.getString(color);
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
};
