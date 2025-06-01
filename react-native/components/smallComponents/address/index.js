import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import Loader from "../loader";
import SaveLoader from "../smLoader";
import {GOOGLE_ADDRESS_API} from "../../../constants/api";

const Address = ({setIsAddress, setStreetNumber, setStreet, setCity, setCountry, setPostalCode, setLat, setLng}) => {
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState("");

    const checkAddress = (data) => {
        console.log(data)
        setError("");
        setTimeout(() => {
            setLoader(false);
        }, 600);
        setLoader(true);

        let streetNumber = "";
        let street = "";
        let city = "";
        let country = "";
        let postalCode = "";

        let addressIndex = 0;

        console.log(data);

        for (let i = 0; i < data.address_components.length; i++) {
            if (data.address_components[i].types[0] === "street_number") {
                streetNumber = data.address_components[i].long_name;
                addressIndex += 1;
            }
            if (data.address_components[i].types[0] === "route") {
                street = data.address_components[i].long_name;
                addressIndex += 1;
            }
            if (data.address_components[i].types[0] === "locality") {
                city = data.address_components[i].long_name;
                addressIndex += 1;
            }
            if (data.address_components[i].types[0] === "country") {
                country = data.address_components[i].long_name;
                addressIndex += 1;
            }
            if (data.address_components[i].types[0] === "postal_code") {
                postalCode = data.address_components[i].long_name;
                addressIndex += 1;
            }
        }
        console.log(addressIndex);
        if (addressIndex === 5) {
            // setLat(data.geometry.location.lat.toFixed(9));
            setLat((parseFloat(data.geometry.location.lat) + Math.random() * 0.00007).toFixed(9));
            setLng((parseFloat(data.geometry.location.lng) + Math.random() * 0.00007).toFixed(9));
            // setLng(data.geometry.location.lng.toFixed(9));
            setStreetNumber(streetNumber);
            setStreet(street);
            setCity(city);
            setCountry(country);
            setPostalCode(postalCode);
            setIsAddress(false);
        } else {
            setError("Please enter a more accurate address.");
        }
    };

    return (
        <View className="flex w-screen rounded-2xl h-full">
            <View
                className="bg-ship-gray-50 pl-4 h-26 pt-8 items-center flex-row justify-between bg-tablebackground border-b border-b-ship-gray-200">
                <Text className="text-3xl font-bold text-normaltext">Select address</Text>
                <TouchableOpacity className="mr-6 items-center justify-center h-16 pt-4"
                                  onPress={() => setIsAddress(false)}>
                    <Text className="text-lg pb-3 text-normaltext">Back</Text>
                </TouchableOpacity>
            </View>
            <View className="h-full w-full">

                {/*<View className="w-full h-10 items-end">*/}
                {/*    <TouchableOpacity*/}
                {/*        onPress={() => {*/}
                {/*            setIsAddress(false);*/}
                {/*        }}>*/}
                {/*        <Text className="text-base mr-6 text-normaltext font-semibold">Back</Text>*/}
                {/*    </TouchableOpacity>*/}
                {/*    <View className="h-10 w-full items-center justify-center">*/}
                {/*        <Text className="text-red-500">{error}</Text>*/}
                {/*    </View>*/}
                {/*</View>*/}

                {/* <Text className="mt-6 ml-6 text-secondtext text-base">Sarch for address</Text> */}
                {loader ? (
                    <View className="h-full w-full p-5 justify-start items-start">
                        <View
                            className="w-full h-12 rounded-md border border-[#e7e5e4] justify-center bg-tablebackground">
                            <SaveLoader/>
                        </View>
                    </View>
                ) : (
                    <View className="h-96 w-full p-5">
                        {/*<View className="border border-[#e7e5e4] p-3  rounded-md flex-row justify-between">*/}
                        {/*    <TextInput className="text-lg">ddd</TextInput>*/}
                        {/*    <TouchableOpacity>*/}
                        {/*        <Text>Search</Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*</View>*/}
                        <Text className='text-base mb-1'>Specify correct address with house number</Text>
                        <GooglePlacesAutocomplete
                            className=""
                            debounce={1000}
                            enablePoweredByContainer={false}
                            placeholder="Search address"
                            minLength={4}
                            autoFocus={true}
                            returnKeyType={"default"}
                            fetchDetails={true}
                            styles={{
                                container: {
                                    flex: 1,
                                },
                                textInputContainer: {
                                    flexDirection: "row",
                                },
                                textInput: {
                                    backgroundColor: "#FFFFFF",
                                    height: 44,
                                    borderRadius: 5,
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    fontSize: 15,
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: "#e7e5e4",
                                },
                                poweredContainer: {
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    borderBottomRightRadius: 5,
                                    borderBottomLeftRadius: 5,
                                    borderColor: "#c8c7cc",
                                    borderTopWidth: 0.5,
                                },
                                powered: {},
                                listView: {
                                    backgroundColor: "#FFFFFF",
                                },
                                row: {
                                    backgroundColor: "#FFFFFF",
                                    padding: 13,
                                    height: 40,
                                    flexDirection: "crow",
                                },
                                separator: {
                                    height: 0,
                                    backgroundColor: "#c8c7cc",
                                },
                                description: {},
                                loader: {
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    height: 20,
                                },
                            }}
                            disableScroll={false}
                            query={{
                                key: GOOGLE_ADDRESS_API,
                                language: "en", // language of the results
                            }}
                            onPress={(data, details) => checkAddress(details)}
                            onFail={(error) => console.error(error)}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

export default Address;
