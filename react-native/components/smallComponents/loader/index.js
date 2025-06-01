import React from "react";
import { View, ActivityIndicator } from "react-native";

const Loader = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#222" />
    </View>
  );
};

export default Loader;
