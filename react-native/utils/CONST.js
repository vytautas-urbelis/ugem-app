import {Platform} from "react-native";

export const MEDIA_URL = __DEV__ ? "https://staging-develop.ugem.app/" : "https://ugem.app/";

export const isIOS = () => {
    return Platform.OS === "ios";
};

export const fontFamilies = {
    NUNITO: {
        light: isIOS() ? "Nunito-Light" : "NunitoLight",
        normal: isIOS() ? "Nunito-Regular" : "NunitoRegular",
        medium: isIOS() ? "Nunito-Medium" : "NunitoMedium",
        bold: isIOS() ? "Nunito-Bold" : "NunitoBold",
    },
    ROBOTO: {
        light: isIOS() ? "Roboto-Light" : "RobotoLight",
        normal: isIOS() ? "Roboto-Regular" : "RobotoRegular",
        medium: isIOS() ? "Roboto-Medium" : "RobotoMedium",
        bold: isIOS() ? "Roboto-Bold" : "RobotoBold",
    },
    // Adjust the above code to fit your chosen fonts' names
};
