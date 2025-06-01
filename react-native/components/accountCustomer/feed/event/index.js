import { Image, View, Text } from "react-native";

const FeedEvent = ({ item }) => {
  return (
    <View className="flex-row gap-4 w-full mb-6">
      <Text>{item.item_type}</Text>
      <Text>{item.data.business_user_profile.business_name}</Text>
      <Image source={{ uri: item.data.business_user_profile.logo }} />
    </View>
  );
};

export default FeedEvent;
