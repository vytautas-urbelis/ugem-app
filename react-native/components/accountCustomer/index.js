import {useEffect, useState} from "react";
import {Dimensions, ImageBackground, StyleSheet, TouchableOpacity, View} from "react-native";

import Animated from "react-native-reanimated";

import Geolocation from "@react-native-community/geolocation";

// import SVGs
import {colors} from "../../constants/colors";
import {SeacrhInputComponent} from "../smallComponents/textInput";

import MAPS from "../../assets/pngs/maps.png";
import {Fontisto, MaterialIcons} from "@expo/vector-icons";
import Feed from "./feed";
import {router} from "expo-router";

const AccountTab = () => {
    const [searchValue, setSearchValue] = useState("");
    const [debounce, setDebounce] = useState(0);
    const [loader, setLoader] = useState(true);
    const [loaded, setLoaded] = useState(true);
    const [isMapImageLoaded, setIsMapImageLoaded] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({latitude: 0, longitude: 0});


    useEffect(() => {
        Geolocation.getCurrentPosition((info) => setCurrentLocation({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude
        }));
    }, []);


    return (
        <View className="">
            <View className="w-full pb-3 flex-row items-center justify-between bg-white px-4">
                {loaded ?
                    <View className="w-[86%]">
                        <SeacrhInputComponent loader={loader} setValue={setSearchValue} placeholder={"Search for ..."}
                                              value={searchValue}/>
                    </View>
                    :
                    <View className="w-[86%]">
                        <View
                            className={`mt-3 border border-ship-gray-200  items-center justify-between flex-row bg-white rounded-xl h-12`}>
                            {/*<Text*/}
                            {/*className={'ml-3 text-lg text-ship-gray-200'}>Search*/}
                            {/*for ...</Text>*/}
                        </View>
                    </View>}

                <TouchableOpacity
                    onPress={() => router.push('homeCustomer/home/scann')}
                    // style={styles.shadowButton}
                    className="w-12 h-12 mt-3 rounded-lg border border-ship-gray-200 bg-white items-center justify-center">
                    <MaterialIcons name="qr-code-2" size={32} color={colors["ship-gray"]["600"]}/>
                </TouchableOpacity>
            </View>
            <View className="flex-1 h-full w-screen bg-white">
                <Feed
                    searchValue={searchValue}
                    debounce={debounce}
                    setDebounce={setDebounce}
                    loader={loader}
                    setLoader={setLoader}
                    currentLocation={currentLocation}
                    setLoaded={setLoaded}
                />
            </View>
            <Animated.View
                className="rounded-t-2xl absolute bottom-4 right-4 items-center">
                <TouchableOpacity onPress={() =>
                    // openMaps()
                    router.navigate('homeCustomer/maps')
                }
                                  className="rounded-full justify-between h-full border-ship-gray-400 border bg-ship-gray-50 px-2">
                    <View
                        className=" h-16 items-center flex-row justify-between">

                        {/*<Text className="text-lg font-semibold text-ship-gray-900 mr-2">Explore</Text>*/}
                        <ImageBackground source={MAPS} resizeMode="cover" onLoad={() => setIsMapImageLoaded(true)}
                                         imageStyle={{opacity: 0.8, borderRadius: 100}}>
                            <View
                                className="h-12 w-12 justify-center items-center border border-ship-gray-300 rounded-full">

                                <Fontisto name="map" size={18} color={colors["ship-gray"]["900"]}/>

                            </View>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default AccountTab;

// Styles
const styles = StyleSheet.create({
    shadow: {
        shadowColor: colors["ship-gray"][700],
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 2,
    },
    mapsShadow: {
        shadowColor: colors["ship-gray"][700],
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 2,
    },
    shadowButton: {
        shadowColor: "#000",
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 1.84,
        elevation: 10,
    },
    photoHeight: {
        height: Dimensions.get("window").width * 0.45,
    },
});
