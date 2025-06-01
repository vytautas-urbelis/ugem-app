import {MMKV} from "react-native-mmkv";

export const collectorStorage = new MMKV({
    id: `collectors`,
});

export const saveCurrentCollectorMMKV = (array) => {
    try {
        const jsonString = JSON.stringify(array);
        collectorStorage.set("collector", jsonString);
    } catch (error) {
        console.error("Error saving data:", error);
    }
};

export const getCurrentCollectorMMKV = () => {
    try {
        const jsonString = collectorStorage.getString("collector");
        if (jsonString) {
            return JSON.parse(jsonString);
        }
        return null;
    } catch (error) {
        console.error("Error retrieving data:", error);
        return null;
    }
};
