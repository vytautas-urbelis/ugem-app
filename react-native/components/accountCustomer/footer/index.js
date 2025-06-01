// import {Text, View} from "react-native";
// import {router} from "expo-router";
// import {useEffect, useState} from "react";
// import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
// import {controlStorage} from "../../../MMKV/control";
// import {colors} from "../../../constants/colors";
// import {FontAwesome5, MaterialCommunityIcons} from "@expo/vector-icons";
// import {getCustomerMMKV} from "../../../MMKV/mmkvCustomer/user";
// import {Pressable} from "react-native-gesture-handler";
//
// export default function Footer({location}) {
//     const [tabColor, setTabColor] = useState("#fff");
//     const [isAnimating, setIsAnimating] = useState(false);
//
//     console.log(location)
//
//
//     const translateY = useSharedValue(100);
//     const opacity = useSharedValue(0);
//
//     const customerIsLogedIn = controlStorage.getBoolean("customerIsLogedIn");
//     const customerProfile = getCustomerMMKV() ? getCustomerMMKV() : null;
//     const is_customer_verified = customerProfile.customer_user_profile.is_verified
//
//     const animatedStyle = useAnimatedStyle(() => {
//         return {
//             transform: [{translateY: translateY.value}],
//             opacity: opacity.value,
//         };
//     });
//
//     useEffect(() => {
//         if (location.startsWith("/homeCustomer/home")) {
//             translateY.value = withSpring(0, {damping: 30, stiffness: 300});
//             opacity.value = withTiming(1, {duration: 100});
//         } else if (!location.startsWith("/homeCustomer/home/cards")) {
//             translateY.value = withTiming(100, {duration: 200});
//             opacity.value = withTiming(0, {duration: 100}, (finished) => {
//                 if (finished) {
//                     runOnJS(setIsAnimating)(false);
//                 }
//             });
//         }
//     }, [location]);
//
//     // useEffect(() => {
//     //     console.log(location.startsWith("/homeCustomer/home/cards"))
//     //     if (location.startsWith("/homeCustomer/home/cards")) {
//     //         translateY.value = withSpring(0, {damping: 30, stiffness: 300});
//     //         opacity.value = withTiming(1, {duration: 100});
//     //     } else if (location !== "/homeCustomer/home/cards") {
//     //         translateY.value = withTiming(100, {duration: 200});
//     //         opacity.value = withTiming(0, {duration: 100}, (finished) => {
//     //             if (finished) {
//     //                 runOnJS(setIsAnimating)(false);
//     //             }
//     //         });
//     //     }
//     // }, [location]);
//
//     function navigate(rout) {
//         router.replace(`homeCustomer/${rout}`);
//     }
//
//     return (
//         <>
//             {(location.startsWith("/homeCustomer/home/cards") || isAnimating) && (
//                 <Animated.View
//                     style={[
//                         {},
//                         animatedStyle,
//                     ]}
//                     className=" h-20 rounded-t-xl bg-ship-gray-50 border border-ship-gray-100">
//                     <View className="flex-row justify-between items-start h-full">
//                         {is_customer_verified ? (
//                             <View className="items-center justify-start w-1/3 h-full">
//                                 <Pressable
//                                     onPress={() => {
//                                         navigate("home/cards/vouchers");
//                                         // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
//                                     }}
//                                 >
//                                     <View className="items-center justify-start w-24 h-full">
//                                         <View className="w-[100%] h-16 justify-center items-center">
//                                             <FontAwesome5 name="gem" size={14} color={colors["ship-gray"]["800"]}/>
//                                             {/* <GEMIES width={48} height={20} fill={"#8d9ffa"} /> */}
//                                             <Text className="text-base text-ship-gray-800 mt-0.5">Gemies</Text>
//                                         </View>
//                                     </View>
//                                 </Pressable>
//                             </View>
//                         ) : (
//                             <View className="items-center justify-start w-1/3 h-full">
//                                 <Pressable
//                                     onPress={() => {
//                                         router.navigate("/");
//                                         // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
//                                     }}
//                                 >
//                                     <View className="items-center justify-start w-24 h-full">
//                                         <View className="w-[100%] h-16 justify-center items-center">
//                                             <FontAwesome5 name="gem" size={18} color={colors["ship-gray"]["800"]}/>
//                                             {/* <GEMIES width={48} height={20} fill={"#8d9ffa"} /> */}
//                                             <Text className="text-base text-ship-gray-800">Gemies</Text>
//                                         </View>
//                                     </View>
//                                 </Pressable>
//                             </View>
//                         )}
//                         {is_customer_verified ? (
//                             <View className="items-center justify-start w-1/3 h-full">
//                                 <Pressable
//                                     onPress={() => {
//                                         navigate("home/cards/collectors");
//                                         // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
//                                     }}
//                                 >
//                                     <View className="items-center justify-start w-24 h-full">
//                                         <View className="w-[100%] h-16 justify-center items-center">
//                                             <MaterialCommunityIcons name="cards" size={18}
//                                                                     color={colors["ship-gray"]["800"]}/>
//                                             {/* <CARDS width={38} height={20} fill={"#49be8a"} /> */}
//                                             <Text className="text-base text-ship-gray-800">Cards</Text>
//                                         </View>
//                                         {/* <TextFontRegular size={12} font={"light"}>
//                     Cards
//                   </TextFontRegular> */}
//                                     </View>
//                                 </Pressable>
//                             </View>
//                         ) : (
//                             <View className="items-center justify-start w-1/3 h-full">
//                                 <Pressable
//                                     onPress={() => {
//                                         router.navigate("/");
//                                         // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
//                                     }}
//                                 >
//                                     <View className="items-center justify-start w-24 h-full">
//                                         <View className="w-[100%] h-16 justify-center items-center">
//                                             <MaterialCommunityIcons name="cards" size={18}
//                                                                     color={colors["ship-gray"]["800"]}/>
//                                             {/* <CARDS width={38} height={20} fill={"#49be8a"} /> */}
//                                             <Text className="text-base text-ship-gray-800">Cards</Text>
//                                         </View>
//                                     </View>
//                                 </Pressable>
//                             </View>
//                         )}
//                         {is_customer_verified ? (
//                             <View className="items-center justify-start w-1/3 h-full">
//                                 <Pressable
//                                     onPress={() => {
//                                         navigate("home/cards/");
//                                         // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
//                                     }}
//                                 >
//                                     <View className="items-center justify-start w-24  h-full">
//                                         <View className="w-[100%] h-16 justify-center items-center">
//                                             <MaterialCommunityIcons name="card-account-details-star-outline" size={18}
//                                                                     color={colors["ship-gray"]["800"]}/>
//                                             {/* <UGEM width={38} height={20} fill={colors.zest["400"]} /> */}
//                                             <Text className="text-base text-ship-gray-800">uGem</Text>
//                                         </View>
//                                     </View>
//                                 </Pressable>
//                             </View>
//                         ) : (
//                             <View className="items-center justify-start w-1/3 h-full">
//                                 <Pressable
//                                     onPress={() => {
//                                         router.navigate("/");
//                                         // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
//                                     }}
//                                 >
//                                     <View className="items-center justify-start w-24 h-full">
//                                         <View className="w-[100%] h-16 justify-center items-center">
//                                             <MaterialCommunityIcons name="card-account-details-star-outline" size={18}
//                                                                     color={colors["ship-gray"]["800"]}/>
//                                             {/* <UGEM width={38} height={20} fill={colors.zest["400"]} /> */}
//                                             <Text className="text-base text-ship-gray-800">uGem</Text>
//                                         </View>
//                                     </View>
//                                 </Pressable>
//                             </View>
//                         )}
//                     </View>
//                 </Animated.View>
//             )}
//         </>
//     );
// }

import {Text, View} from "react-native";
import {router} from "expo-router";
import {useEffect, useState} from "react";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {getCustomerMMKV} from "../../../MMKV/mmkvCustomer/user";
import {Pressable} from "react-native-gesture-handler";
import DIAMOND from "../../../assets/svg/footer/diamond.svg"
import DIAMOND_FULL from "../../../assets/svg/footer/diamond-full.svg"
import CARDS from "../../../assets/svg/footer/cards.svg"
import CARDS_FULL from "../../../assets/svg/footer/cards-full.svg"
import STAR from "../../../assets/svg/footer/star.svg"
import STAR_FULL from "../../../assets/svg/footer/star-full.svg"
import {colors} from "../../../constants/colors";

export default function Footer({location}) {
    const [isAnimating, setIsAnimating] = useState(false);

    const translateY = useSharedValue(100);
    const opacity = useSharedValue(0);

    const customerProfile = getCustomerMMKV() ? getCustomerMMKV() : null;
    const is_customer_verified = customerProfile.customer_user_profile.is_verified

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateY: translateY.value}],
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        if (location.startsWith("/homeCustomer/home")) {
            translateY.value = withSpring(0, {damping: 30, stiffness: 300});
            opacity.value = withTiming(1, {duration: 100});
        } else if (!location.startsWith("/homeCustomer/home/cards")) {
            translateY.value = withTiming(100, {duration: 200});
            opacity.value = withTiming(0, {duration: 100}, (finished) => {
                if (finished) {
                    runOnJS(setIsAnimating)(false);
                }
            });
        }
    }, [location]);

    function navigate(rout) {
        if (location === `/homeCustomer/${rout}`) {
            return null
        } else {
            router.push(`/homeCustomer/${rout}`);
        }

    }

    return (
        <>
            {(location.startsWith("/homeCustomer/home/cards") || isAnimating) && (
                <Animated.View
                    style={[
                        {},
                        animatedStyle,
                    ]}
                    className=" h-20 rounded-t-xl bg-ship-gray-50 border border-ship-gray-100">
                    <View className="flex-row justify-between items-start h-full">
                        {is_customer_verified ? (
                            <View className="items-center justify-start w-1/3 h-full">
                                <Pressable
                                    onPress={() => {
                                        navigate("home/cards/vouchers");
                                        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                    }}
                                >
                                    <View className="items-center justify-start w-24 h-full">
                                        <View className="w-[100%] h-16 justify-center items-center">
                                            {location === "/homeCustomer/home/cards/vouchers" ?
                                                <DIAMOND_FULL width={48} height={22}
                                                              fill={colors['ship-gray']["900"]}/> :
                                                <DIAMOND width={48} height={22} fill={"#fff"}
                                                         stroke={colors['ship-gray']["900"]}/>}
                                            {/* <GEMIES width={48} height={20} fill={"#8d9ffa"} /> */}
                                            <Text className="text-sm text-ship-gray-800 mt-0.5">Gemies</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                        ) : (
                            <View className="items-center justify-start w-1/3 h-full">
                                <Pressable
                                    onPress={() => {
                                        router.navigate("/");
                                        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                    }}
                                >
                                    <View className="items-center justify-start w-24 h-full">
                                        <View className="w-[100%] h-16 justify-center items-center">
                                            {location === "/homeCustomer/home/cards/vouchers" ?
                                                <DIAMOND_FULL width={48} height={22}
                                                              fill={colors['ship-gray']["900"]}/> :
                                                <DIAMOND width={48} height={22} fill={"#fff"}
                                                         stroke={colors['ship-gray']["900"]}/>}
                                            <Text className="text-sm text-ship-gray-800">Gemies</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                        )}
                        {is_customer_verified ? (
                            <View className="items-center justify-start w-1/3 h-full">
                                <Pressable
                                    onPress={() => {
                                        navigate("home/cards/collectors");
                                        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                    }}
                                >
                                    <View className="items-center justify-start w-24 h-full">
                                        <View className="w-[100%] h-16 justify-center items-center">
                                            {location === "/homeCustomer/home/cards/collectors" ?
                                                <CARDS_FULL width={48} height={22} fill={colors['ship-gray']["900"]}/> :
                                                <CARDS width={48} height={22} fill={"#fff"}
                                                       stroke={colors['ship-gray']["900"]}/>}
                                            <Text className="text-sm text-ship-gray-800">Cards</Text>
                                        </View>
                                        {/* <TextFontRegular size={12} font={"light"}>
                    Cards
                  </TextFontRegular> */}
                                    </View>
                                </Pressable>
                            </View>
                        ) : (
                            <View className="items-center justify-start w-1/3 h-full">
                                <Pressable
                                    onPress={() => {
                                        router.navigate("/");
                                        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                    }}
                                >
                                    <View className="items-center justify-start w-24 h-full">
                                        <View className="w-[100%] h-16 justify-center items-center">
                                            {location === "/homeCustomer/home/cards/collectors" ?
                                                <CARDS_FULL width={48} height={22} fill={colors['ship-gray']["900"]}/> :
                                                <CARDS width={48} height={22} fill={"#fff"}
                                                       stroke={colors['ship-gray']["900"]}/>}
                                            <Text className="text-sm text-ship-gray-800">Cards</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                        )}
                        {is_customer_verified ? (
                            <View className="items-center justify-start w-1/3 h-full">
                                <Pressable
                                    onPress={() => {
                                        navigate("home/cards");
                                        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                    }}
                                >
                                    <View className="items-center justify-start w-24  h-full">
                                        <View className="w-[100%] h-16 justify-center items-center">
                                            {location === "/homeCustomer/home/cards" ?
                                                <STAR_FULL width={48} height={22} fill={colors['ship-gray']["900"]}/> :
                                                <STAR width={48} height={22} fill={"#fff"}
                                                      stroke={colors['ship-gray']["900"]}/>}
                                            <Text className="text-sm text-ship-gray-800">uGem</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                        ) : (
                            <View className="items-center justify-start w-1/3 h-full">
                                <Pressable
                                    onPress={() => {
                                        router.navigate("/");
                                        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                    }}
                                >
                                    <View className="items-center justify-start w-24 h-full">
                                        <View className="w-[100%] h-16 justify-center items-center">
                                            {location === "/homeCustomer/home/cards" ?
                                                <STAR_FULL width={48} height={22} fill={colors['ship-gray']["900"]}/> :
                                                <STAR width={48} height={22} fill={"#fff"}
                                                      stroke={colors['ship-gray']["900"]}/>}
                                            <Text className="text-sm text-ship-gray-800">uGem</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </Animated.View>
            )}
        </>
    );
}

