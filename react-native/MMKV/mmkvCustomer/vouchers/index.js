import {MMKV} from "react-native-mmkv";

export const voucherStorage = new MMKV({
    id: `vouchers`,
});

export const saveCurrentVoucherMMKV = (array) => {
    try {
        const jsonString = JSON.stringify(array);
        voucherStorage.set("voucher", jsonString);
    } catch (error) {
        console.error("Error saving data:", error);
    }
};

export const getCurrentVoucherMMKV = () => {
    try {
        const jsonString = voucherStorage.getString("voucher");
        if (jsonString) {
            return JSON.parse(jsonString);
        }
        return null;
    } catch (error) {
        console.error("Error retrieving data:", error);
        return null;
    }
};
