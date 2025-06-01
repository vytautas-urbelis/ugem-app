import {MMKV} from "react-native-mmkv";

export const promotionStorage = new MMKV({
    id: `promotions`,
});

export const saveCurrentPromotionMMKV = (array) => {
    try {
        const jsonString = JSON.stringify(array);
        promotionStorage.set("promotion", jsonString);
    } catch (error) {
        console.error("Error saving data:", error);
    }
};

export const getCurrentPromotionMMKV = () => {
    try {
        const jsonString = promotionStorage.getString("promotion");
        if (jsonString) {
            return JSON.parse(jsonString);
        }
        return null;
    } catch (error) {
        console.error("Error retrieving data:", error);
        return null;
    }
};

export const saveCurrentPromotionBusinessProfileMMKV = (array) => {
    try {
        const jsonString = JSON.stringify(array);
        promotionStorage.set("businessProfile", jsonString);
    } catch (error) {
        console.error("Error saving data:", error);
    }
};

export const getCurrentPromotionBusinessProfileMMKV = () => {
    try {
        const jsonString = promotionStorage.getString("businessProfile");
        if (jsonString) {
            return JSON.parse(jsonString);
        }
        return null;
    } catch (error) {
        console.error("Error retrieving data:", error);
        return null;
    }
};


