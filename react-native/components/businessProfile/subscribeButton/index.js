import {Text, TouchableOpacity} from "react-native";

const SubscribeButton = ({toggleSubscribe, businessId, businessProfile, setBusinessProfile}) => {
    return (
        <>
            {businessProfile.subscribing ? (
                <TouchableOpacity onPress={() => toggleSubscribe()}
                                  className="ml-2 rounded-xl border border-ship-gray-400 items-center justify-center p-2">
                    <Text className="text-xs flex-wrap text-ship-gray-400 font-semibold">Unsubscribe</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => toggleSubscribe()}
                                  className="ml-2 bg-zest-300 border border-zest-300 rounded-xl items-center justify-center p-2">
                    <Text className="text-xs flex-wrap text-ship-gray-900 font-semibold">Subscribe</Text>
                </TouchableOpacity>
            )}
        </>
    );
};

export default SubscribeButton;
