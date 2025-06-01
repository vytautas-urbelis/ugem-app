import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import WallMessageInBusinessProfile from "./messageView";

const WallMessagesBusinessProfile = ({ messages, businessProfile }) => {
  return (
    <View className="flex-1">
      {messages.map((message, index) => (
        <Pressable>
          <WallMessageInBusinessProfile message={message} businessProfile={businessProfile} index={index} key={message.id} />
        </Pressable>
      ))}
    </View>
  );
};

export default WallMessagesBusinessProfile;
