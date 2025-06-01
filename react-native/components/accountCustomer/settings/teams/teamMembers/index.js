import { View, Text } from "react-native";
import { useState } from "react";
import SentRequest from "./request";

const TeamMembersSection = ({ teamMembers, HandleRequestEvent }) => {

  return (
    <>
      <View>
        {teamMembers.length === 0 ? <></> : <Text className="mt-6 text-lg text-left font-semibold text-ship-gray-900 ">My team</Text>}
        {teamMembers ? (
          <View className="">
            {teamMembers.map((request) => (
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

export default TeamMembersSection;
