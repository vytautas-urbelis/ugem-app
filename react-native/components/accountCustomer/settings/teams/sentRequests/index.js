import { View, Text } from "react-native";
import { useState } from "react";
import SentRequest from "./request";

const SentRequestsSection = ({ sentRequests, HandleRequestEvent }) => {

  return (
    <>
      <View>
        {sentRequests.length === 0 ? <></> : <Text className="mt-6 text-lg text-left font-semibold text-ship-gray-900 ">Pending requests</Text>}
        {sentRequests ? (
          <View className="">
            {sentRequests.map((request) => (
              <View key={request.id}>
                <SentRequest request={request} HandleRequestEvent={HandleRequestEvent} />
              </View>
            ))}
          </View>
        ) : (
          <></>
        )}
      </View>
    </>
  );
};

export default SentRequestsSection;
