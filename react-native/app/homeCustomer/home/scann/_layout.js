import { Slot } from "expo-router";

import { View } from "react-native";

export default function ScanLayout() {
  return (
    <>
      <View className="flex flex-1">
        <Slot />
      </View>
    </>
  );
}
