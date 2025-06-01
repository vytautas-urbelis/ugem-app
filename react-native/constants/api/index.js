import { Platform } from "react-native";

// export const GOOGLE_ADDRESS_API = 'AIzaSyCWiU1mbYvX_HSTVAA8fBWjmcyCasOx2Sw'

export const GOOGLE_ADDRESS_API = Platform.select({
  ios: `AIzaSyCBd9PmKorIuE7GstQLP5CBHnq78KICYYA`,
  android: `AIzaSyB1uqnk0BoT4nm8M2np73BcfrgSqido4GU`,
});

export const iosClientId = "558275846498-1b8kc59k40ms69do83rp71r9frdsbnr0.apps.googleusercontent.com";
export const webClientId = "558275846498-c7avpq93981tmdtljmjpe82qs8fddkpf.apps.googleusercontent.com";

export const revenCatAppleAPI = "appl_bhNXiXeXKKsBRNtAVdlqyxgsEzu";
export const revenCatAndroidAPI = "goog_pmvfjXvpUpwqQYMeMWubgfcYZZm";
