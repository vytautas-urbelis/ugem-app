import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const SaveLoader = () => {
  return (
    <View className="items-end justify-start pr-2">
      <ActivityIndicator size="small" color="#222" />
    </View>
  );
};

export default SaveLoader;