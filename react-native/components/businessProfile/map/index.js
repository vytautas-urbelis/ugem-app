import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Dimensions, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { colors } from "../../../constants/colors";

const Map = ({ latitude, longitude, url }) => {
  return (
    <View className="px-2 pb-2  bg-ship-gray-200 rounded-xl mt-1">
      <View className=" w-full items-end">
        <View>
          {/* <Text className="text-base text-ship-gray-900 font-semibold">Address</Text> */}
          <TouchableOpacity
            className=" flex-row items-center justify-center"
            onPress={() =>
              Linking.openURL(
                url,
                // `https://www.google.com/search?q=${businessProfile.business_user_profile.street}+${businessProfile.business_user_profile.street_number}+${businessProfile.business_user_profile.zip}+${businessProfile.business_user_profile.city}`,
              )
            }>
            <Text className="text-base my-1 text-ship-gray-800 mr-1">Get directions</Text>
            <MaterialIcons name="directions" size={20} color={colors['ship-gray']['700']}/>
          </TouchableOpacity>
        </View>
      </View>
      <View className="  w-full h-48  rounded-lg bg-white">
        <MapView
          style={{ width: "100%", height: "100%", borderRadius: 8 }}
          cacheEnabled={true}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            key={1}
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}></Marker>
        </MapView>
      </View>
    </View>
  );
};

export default Map;

// Styles
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1.84,
    elevation: 2,
  },
  photoHeight: {
    height: Dimensions.get("window").width * 0.45,
  },
});
