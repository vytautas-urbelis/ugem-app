import { View, Text, Image } from "react-native";
import IncomingRequest from "./request";

const IncomingRequestsSection = ({ incominRequests, HandleRequestEvent }) => {
  return (
    <>
      <View>
        {incominRequests.length === 0 ? <></> : <Text className="mt-6 text-lg text-left font-semibold text-ship-gray-900 ">Incoming requests</Text>}
        {incominRequests ? (
          <View className="">
            {incominRequests.map((request) => (
              <View key={request.id}>
                <IncomingRequest request={request} HandleRequestEvent={HandleRequestEvent} />
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

export default IncomingRequestsSection;
