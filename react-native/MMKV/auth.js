import { MMKV } from "react-native-mmkv";

export const authStorage = new MMKV({
  id: `auth`,
});