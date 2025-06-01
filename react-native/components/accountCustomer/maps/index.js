import {useEffect, useRef, useState} from "react";
import {Image, ImageBackground, Linking, Platform, Text, View} from "react-native";
import MapView, {AnimatedRegion, Marker} from "react-native-maps";

import Geolocation from "@react-native-community/geolocation";
import {GetBusinessesForMap, SearchForBusinesses} from "../../../axios/axiosCustomer/business";
import {SeacrhInputComponent} from "../../smallComponents/textInput";
import {authStorage} from "../../../MMKV/auth";
import ResultView from "./resultView";
import {shorterText} from "../../../utils/textFormating";
import {colors} from "../../../constants/colors";
import Animated, {useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {AntDesign, EvilIcons, MaterialCommunityIcons} from "@expo/vector-icons";
import {router} from "expo-router";
import {Pressable, ScrollView} from "react-native-gesture-handler";
import {isIOS} from "../../../utils/CONST";

const MapsTab = ({latitude, longitude, givenBusinessId}) => {
    // Reference to the MapView component
    const mapRef = useRef(null);

    // References to markers, keyed by business ID
    const markerRefs = useRef({});

    // Access token for API requests
    const accessToken = authStorage.getString("accessToken");

    // State variables for search functionality
    const [searchValue, setSearchValue] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [businessesOnMap, setBusinessesOnMap] = useState(null);

    // Debounce and loader state variables
    const [debounce, setDebounce] = useState(0);
    const [loader, setLoader] = useState(false);

    // Map region state variables
    const [initialRegion, setInitialRegion] = useState(null);
    const [animatedRegion, setAnimatedRegion] = useState(null);
    const [latitudeDelta, setLatitudeDelta] = useState(0.0922);
    const [longitudeDelta, setLongitudeDelta] = useState(0.0421);

    // Selected business and profile preview state variables
    const [business, setBusiness] = useState(null);
    const [showProfilePreview, setShowProfilePreview] = useState(false);

    // Opacity for UI components during map interactions
    const [componentsOpacity, setComponentsOpacity] = useState(0.1);

    // Keep a list (array) of timeout IDs
    const timeoutsRef = useRef([]);

    // Example function to schedule a timeout
    const scheduleTimeout = (callback, delay) => {
        const timeoutId = setTimeout(callback, delay);
        timeoutsRef.current.push(timeoutId);
    };

    useEffect(() => {
        // Instead of setTimeout(...) directly, call scheduleTimeout
        scheduleTimeout(() => setComponentsOpacity(0.9), 1000);
        scheduleTimeout(() => {
            // logic for animated region
        }, 600);

        // Cleanup: clear all timeouts if component unmounts
        return () => {
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];
        };
    }, []);


    // Function to generate a URL for getting directions to the selected business
    const getDirections = () => {
        const scheme = Platform.select({
            ios: "maps://0,0?q=",
            android: "geo:0,0?q=",
        });
        const latLng = `${business.latitude},${business.longitude}`;
        const label = business.business_name;
        return Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });
    };

    // Fetch businesses to display on the map when the initial region is set
    useEffect(() => {
        setLoader(true);

        // setting components opacity to 0.9 (good visible)
        setTimeout(() => {
            setComponentsOpacity(0.9);
        }, 1000);

        const getBusinessesOnMap = async () => {
            try {
                const results = await GetBusinessesForMap(accessToken, initialRegion.latitude, initialRegion.longitude);
                setBusinessesOnMap(results);
            } catch (error) {
                alert("There is a connection problem!");
                console.log(error);
            } finally {
                setLoader(false);
            }
        };
        if (initialRegion) {
            getBusinessesOnMap();
        }
    }, [initialRegion]);

    // Fetch businesses to display on the map when the region changes
    const getBusinessesForMapOnRegionChanged = async (event) => {
        try {
            const results = await GetBusinessesForMap(accessToken, parseFloat(event.latitude), parseFloat(event.longitude));
            setBusinessesOnMap(results);
        } catch (error) {
            alert("There is a connection problem!");
            console.log(error);
        } finally {
            setLoader(false);
        }
    };

    // Handle search input changes with debounce
    useEffect(() => {
        if (searchValue === "") {
            setSearchResults(null);
        }
        setLoader(true);
        setDebounce(500);

        // Clear previous timeout
        clearTimeout(timeoutId);

        // Set a new timeout for debouncing search input
        const timeoutId = setTimeout(async () => {
            if (searchValue) {
                try {
                    const results = await SearchForBusinesses(accessToken, searchValue, initialRegion.latitude, initialRegion.longitude);
                    setSearchResults(results);
                } catch (error) {
                    alert("There is a connection problem!");
                    console.log(error);
                } finally {
                    setLoader(false);
                }
            }
        }, debounce);

        // Cleanup timeout on unmount or when searchValue changes
        return () => clearTimeout(timeoutId);
    }, [searchValue]);

    // Set the customer's current location as the initial region
    useEffect(() => {
        Geolocation.getCurrentPosition((info) =>
            setInitialRegion({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta,
            }),
        );
    }, []);

    // Set up AnimatedRegion for smooth map movements
    useEffect(() => {

        scheduleTimeout(() => {
                if (initialRegion) {
                    setAnimatedRegion(
                        new AnimatedRegion({
                            latitude: initialRegion.latitude,
                            longitude: initialRegion.longitude,
                            latitudeDelta: initialRegion.latitudeDelta,
                            longitudeDelta: initialRegion.longitudeDelta,
                        }),
                    );
                }
            }, 600
        )
    }, [initialRegion]);

    // Move the map to a specific location when opening from a business profile
    useEffect(() => {

        if (latitude && longitude) {
            scheduleTimeout(() => {
                mapRef.current.animateToRegion(
                    {
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                        latitudeDelta: 0.0000922,
                        longitudeDelta: 0.00421,
                    },
                    1000, // Duration in milliseconds
                );
                getBusinessesForMapOnRegionChanged({
                    latitude: latitude,
                    longitude: longitude,
                });
            }, 1000)
            scheduleTimeout(() => {
                // Access the marker reference and show its callout
                const markerRef = markerRefs.current[givenBusinessId];
                if (markerRef) {
                    markerRef.showCallout();
                } else {
                    console.warn(`No marker found for business ID: ${givenBusinessId}`);
                }
            }, 2100)
        }
    }, [latitude, longitude]);

    // Handle marker selection on the map
    const onMarkerSelect = (business, event) => {
        const {latitude, longitude, latitudeDelta, longitudeDelta} = event.nativeEvent.coordinate;

        // Reset business state and show profile preview
        setTimeout(() => {
            setBusiness(business);
            setShowProfilePreview(true);
        }, 450);

        // Animate the map to the selected marker's region
        mapRef.current.animateToRegion(
            {
                latitude,
                longitude,
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta,
            },
            400, // Duration in milliseconds
        );
    };

    // Handle pressing on a search result
    const handleOnResultPress = async (latitude, longitude, business) => {
        // Cleane business state
        setBusiness(null);
        setShowProfilePreview(false);

        // Fetch businesses for the new region
        await getBusinessesForMapOnRegionChanged({
            latitude: latitude,
            longitude: longitude,
        });

        // Animate the map to the new region
        mapRef.current.animateToRegion(
            {
                latitude,
                longitude,
                latitudeDelta: 0.000922,
                longitudeDelta: 0.01221,
            },
            800, // Duration in milliseconds
        );
        scheduleTimeout(() => {
            // Access the marker reference and show its callout
            const markerRef = markerRefs.current[business.user.id];
            if (markerRef) {
                markerRef.showCallout();
            } else {
                console.warn(`No marker found for business ID: ${business.user.id}`);
            }
        }, 1100);

        // Update state to display the business info
        scheduleTimeout(() => {
            setBusiness(business);
            setShowProfilePreview(true);
        }, 1200);

    };

    return (
        <View className="flex-1 h-screen w-screen bg-white">
            {/* Search Input Component */}
            <View style={{opacity: componentsOpacity}} className="w-full px-4 absolute z-10 top-24">
                <SeacrhInputComponent loader={loader} setValue={setSearchValue} placeholder={"Search for ..."}
                                      value={searchValue}/>
            </View>

            {/* Display Search Results */}
            {searchResults && (
                <View className="px-4 absolute z-10 top-40 max-h-56 w-full rounded-xl">
                    <ScrollView className="w-full rounded-xl borde border-ship-gray-200">
                        <ImageBackground
                            imageStyle={{opacity: componentsOpacity, backgroundColor: "#fff", borderRadius: 10}}
                        >
                            {/*<Pressable>*/}
                            {searchResults.map((res) => {
                                return (
                                    <ResultView
                                        key={res.data.user.id}
                                        result={res}
                                        initialRegion={initialRegion}
                                        handleOnResultPress={handleOnResultPress}
                                        setSearchValue={setSearchValue}
                                    />
                                );
                            })}
                            {/*</Pressable>*/}
                        </ImageBackground>
                    </ScrollView>
                </View>
            )}

            {/* Active Business Preview */}
            <ActiveBusiness
                business={business}
                setBusiness={setBusiness}
                showProfilePreview={showProfilePreview}
                setShowProfilePreview={setShowProfilePreview}
                componentsOpacity={componentsOpacity}
            />

            {/* MapView Component */}
            {animatedRegion && (
                <MapView
                    style={{width: "100%", height: "100%"}}
                    ref={mapRef}
                    showsMyLocationButton={false}
                    toolbarEnabled={false}
                    showsUserLocation={true}
                    onRegionChange={() => {
                        setComponentsOpacity(0.6);
                    }}
                    onRegionChangeComplete={(event) => {
                        getBusinessesForMapOnRegionChanged(event);
                        setComponentsOpacity(0.9);
                    }}
                    region={{
                        latitude: animatedRegion.latitude.__getValue(),
                        longitude: animatedRegion.longitude.__getValue(),
                        latitudeDelta: animatedRegion.latitudeDelta.__getValue(),
                        longitudeDelta: animatedRegion.longitudeDelta.__getValue(),
                    }}
                    onPress={() => {
                        setBusiness(null);
                    }}>
                    {/* Render Markers for Businesses */}
                    {businessesOnMap && (
                        <>
                            {businessesOnMap.map((business) => {
                                return (
                                    <Marker
                                        style={{width: 40, height: 40}}
                                        ref={(ref) => {
                                            markerRefs.current[business.user.id] = ref;
                                        }}
                                        onSelect={(event) => {
                                            onMarkerSelect(business, event);
                                        }}
                                        key={business.user.id}
                                        pinColor={colors['ship-gray']['900']}
                                        titleVisibility={'visible'}
                                        title={business.business_name}
                                        description={shorterText(business.about, 34)}
                                        coordinate={{
                                            latitude: parseFloat(business.latitude),
                                            longitude: parseFloat(business.longitude),
                                        }}>
                                        {isIOS() &&
                                            <View className="">
                                                {business.logo ?
                                                    <Image
                                                        source={{uri: `${business.logo}`}}
                                                        className="w-[40] h-[40] rounded-md border border-ship-gray-300"
                                                        alt="qr code"
                                                    /> : <View
                                                        className="w-[40] h-[40] rounded-md border bg-white border-ship-gray-300 items-center justify-center">
                                                        <Text
                                                            className="text-lg font-semibold">{business.business_name.charAt(0).toUpperCase()}
                                                        </Text>
                                                    </View>
                                                }
                                                {/* Optional business name below the marker */}
                                                {/* <Text className="text-xs font-semibold">{business.business_name}</Text>*/}
                                            </View>
                                        }
                                        {/*{!isIOS() &&*/}
                                        {/*    <View className="">*/}
                                        {/*        <View*/}
                                        {/*            className="w-[30] h-[30] rounded-md border bg-white border-ship-gray-300 items-center justify-center">*/}
                                        {/*            <Text*/}
                                        {/*                className="text-lg font-semibold">{business.business_name.charAt(0).toUpperCase()}*/}
                                        {/*            </Text>*/}
                                        {/*        </View>*/}
                                        {/*        /!* Optional business name below the marker *!/*/}
                                        {/*        /!* <Text className="text-xs font-semibold">{business.business_name}</Text>*!/*/}
                                        {/*    </View>}*/}
                                    </Marker>
                                );
                            })}
                        </>
                    )}
                </MapView>
            )}

            {/* Close Maps Button */}
            <View
                className="absolute left-4 w-10 h-10 bg-white rounded-full border border-ship-gray-200 top-12 items-center justify-center z-50">
                <Pressable
                    // onPress={closeMaps}
                    onPress={() => {
                        router.back()
                    }}>
                    <View className="w-20 h-20  rounded-full  items-center justify-center">
                        <EvilIcons
                            name="close" size={24} color="black"/>
                    </View>
                </Pressable>
            </View>

            {/* Get Directions Button */}
            {business && (
                <View
                    className="absolute bottom-36 right-4 w-12 h-12 bg-white rounded-full items-center justify-center z-20 border border-ship-gray-200">
                    <Pressable
                        onPress={() => Linking.openURL(getDirections())}>
                        <MaterialCommunityIcons name="directions" size={32} color={colors["zest"]["400"]}/>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

export const ActiveBusiness = ({business, componentsOpacity, showProfilePreview, setShowProfilePreview}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    // Animation settings for the profile preview
    const translateY = useSharedValue(150);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateY: translateY.value}],
        };
    });

    // Animate the profile preview in and out based on state changes
    useEffect(() => {
        if (business && showProfilePreview) {
            translateY.value = withSpring(0, {damping: 30, stiffness: 300});
        } else if (!business || !showProfilePreview) {
            translateY.value = withTiming(150, {duration: 300});
        }
    }, [business, showProfilePreview]);

    return (
        <Animated.View style={[animatedStyle]} className="rounded-2xl px-4 w-full items-center absolute bottom-4 z-20">
            <View className={'w-full border border-ship-gray-200 rounded-2xl'}>
                <ImageBackground imageStyle={{opacity: componentsOpacity, backgroundColor: "#fff", borderRadius: 16}}>
                    {business && (
                        <>

                            {/* Business Profile Preview */}
                            <Pressable onPress={() =>
                                router.push({
                                    pathname: `/homeCustomer/businessProfile/${business.user.id}`,
                                    params: {businessID: business.user.id, fromMap: true},
                                })

                            }
                                       className="rounded-t-2xl justify-between items-center w-full h-full ">
                                <View className="w-full flex flex-row justify-between">
                                    {business.logo ? (
                                        <Image
                                            onLoad={() => setImageLoaded(true)}
                                            source={{uri: business.logo}}
                                            className="flex-none w-24 h-24 m-3 border border-ship-gray-200 rounded-2xl opacity-100 "
                                            alt="qr code"
                                        />
                                    ) : (
                                        <View
                                            className=" w-24 h-24 items-center justify-center bg-ship-gray-200 m-3 border border-ship-gray-200 rounded-2xl opacity-100 ">
                                            <Text className="text-5xl font-semibold text-ship-gray-700">
                                                {business.business_name.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                    )}

                                    <View className="w-full h-full flex-shrink my-2 mr-3">
                                        <View className="w-full flex-row flex-shrink justify-between ">
                                            <View className="shrink flex-row">
                                                <Text
                                                    className="text-xl font-semibold text-wrap">{business.business_name}</Text>
                                            </View>
                                            <View className="flex-none items-start flex-row">
                                                <Text
                                                    className="text-lg text-ship-gray-400 text-center mr-2">{business.user.number_of_ratings}</Text>
                                                <AntDesign name="star" size={20} color={colors["zest"][400]}/>
                                                <Text
                                                    className="text-xl font-semibold text-ship-gray-800 text-center ml-2">{business.user.rating.toFixed(1)}</Text>
                                            </View>
                                        </View>
                                        <View className="mt-1 mb-3">
                                            <Text
                                                className="text-xs text-wrap">{shorterText(business.about, 200)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        </>
                    )}
                </ImageBackground>
            </View>
        </Animated.View>
    );
};

export default MapsTab;