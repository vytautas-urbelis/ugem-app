import {router, Slot, usePathname} from "expo-router";

import {View} from "react-native";
import Animated, {cancelAnimation, useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {Entypo, MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../../../constants/colors";
import Header from "../../../components/accountCustomer/header";
import {useEffect, useState} from "react";
import * as Haptics from "expo-haptics";
import Footer from "../../../components/accountCustomer/footer";
import {Pressable} from "react-native-gesture-handler";
import {getCustomerMMKV, userStorage} from "../../../MMKV/mmkvCustomer/user";

export default function HomeLayout() {
    const [customerUser, setCustomerUser] = useState(getCustomerMMKV());

    const homeTransformX = useSharedValue(0);
    const accountTransformX = useSharedValue(100);

    const homeAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: homeTransformX.value}],
    }));

    const accountAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: accountTransformX.value}],
    }));


    useEffect(() => {
        const listener = userStorage.addOnValueChangedListener((changedKey) => {
            if (changedKey === "customer") {
                setCustomerUser(getCustomerMMKV())
            }
        })

        return () => {
            listener.remove()
        }
    })

    const pathLocation = usePathname()

    useEffect(() => {
        if (pathLocation === "/homeCustomer/home/feed") {
            homeTransformX.value = withSpring(0, {damping: 30, stiffness: 1000});
            accountTransformX.value = withSpring(100, {damping: 30, stiffness: 1000});
        } else if (pathLocation !== "/homeCustomer/home") {
            homeTransformX.value = withSpring(100, {damping: 30, stiffness: 1000});
            accountTransformX.value = withSpring(0, {damping: 30, stiffness: 1000});
        }

        return () => {
            cancelAnimation(homeTransformX);
            cancelAnimation(accountTransformX)
        }
    }, [pathLocation]);

    const navigate = () => {
        if (pathLocation === "/homeCustomer/home/feed") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.replace("homeCustomer/home/cards");
        } else if (pathLocation !== "/homeCustomer/home") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.replace("homeCustomer/home/feed");
        }
    };


    return (
        <>
            <Header customerUser={customerUser}/>
            <Slot/>
            <Footer location={pathLocation}></Footer>
            <Animated.View style={homeAnimatedStyle} className="absolute top-10 right-1">
                <View className="w-16 h-16 items-center justify-center">
                    <Pressable
                        onPress={() => {
                            navigate();
                        }}
                        className="w-16 h-16  items-center justify-center">
                        <View className="w-20 h-20  items-center justify-center">
                            <MaterialCommunityIcons name="card-account-details-star-outline" size={24}
                                                    color={colors["ship-gray"]["800"]}/>
                        </View>
                    </Pressable>
                </View>
            </Animated.View>
            <Animated.View style={accountAnimatedStyle} className="absolute top-10 right-1">
                <View className="w-16 h-16 items-center justify-center">
                    <Pressable
                        onPress={() => {
                            navigate();
                        }}
                    >
                        <View className="w-20 h-20  items-center justify-center">
                            <Entypo name="globe" size={24} color={colors["ship-gray"]["800"]}/>
                        </View>
                    </Pressable>
                </View>
            </Animated.View></>

    );
}
