import {MMKV} from "react-native-mmkv";

export const campaignStorage = new MMKV({
    id: `campaigns`,
});

export const saveCurrentCampaignMMKV = (array) => {
    try {
        const jsonString = JSON.stringify(array);
        campaignStorage.set("campaign", jsonString);
    } catch (error) {
        console.error("Error saving data:", error);
    }
};

export const getCurrentCampaignMMKV = () => {
    try {
        const jsonString = campaignStorage.getString("campaign");
        if (jsonString) {
            return JSON.parse(jsonString);
        }
        return null;
    } catch (error) {
        console.error("Error retrieving data:", error);
        return null;
    }
};
