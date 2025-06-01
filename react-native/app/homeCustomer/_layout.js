import {Stack, usePathname} from "expo-router";

import {Dimensions, View} from "react-native";

import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

import {Gesture, GestureDetector} from "react-native-gesture-handler";
import AccountSettings from "../../components/accountCustomer/settings";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../MMKV/control";
import {useEffect, useState} from "react";
import OutsidePressHandler from "react-native-outside-press";

export default function HomeLayout() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    const settingsBarPosition = useSharedValue(-300);
    const currentPosition = useSharedValue(-300);

    const [isAccountSettings, setIsAccountSettings] = useMMKVBoolean('isAccountSettings', controlStorage)
    const [isReward, setIsReward] = useState(null)

    const pathname = usePathname();

    const isHome = pathname === '/homeCustomer/home/cards' || pathname === '/homeCustomer/home' ? true : false;


    const settingsBarAnimatedStyle = useAnimatedStyle(() => {
        return {transform: [{translateX: settingsBarPosition.value}]}
    })
    const switchSettingsOn = () => {
        setTimeout(() => {
            setIsAccountSettings(true)
        }, 220)

    }

    const switchSettingsOff = () => {
        settingsBarPosition.value = withTiming(-300, {duration: 300})
        currentPosition.value = -300
        setIsAccountSettings(false)
    }

    useEffect(() => {
        if (isAccountSettings) {
            settingsBarPosition.value = withTiming(0, {duration: 300})
        } else if (!isAccountSettings) {
            settingsBarPosition.value = withTiming(-300, {duration: 300})
            currentPosition.value = -300
        }

    }, [isAccountSettings]);


    const settingsPanHandler = Gesture.Pan()
        .onChange((event) => {
            if (event.translationX <= -30) {
                settingsBarPosition.value = event.translationX
            }
        })
        .onFinalize((event) => {
            if (event.translationX <= -30) {
                // lastPosition.value = event.translationX + lastPosition.value;
                if (event.velocityX <= -10) {
                    settingsBarPosition.value = withTiming(-300, {duration: 200})
                    currentPosition.value = -300
                } else {
                    settingsBarPosition.value = withTiming(0, {duration: 200})
                }
            }
        })

    const emptyPan = Gesture.Pan()

    const panHandler = Gesture.Pan()
        .enabled(isHome)
        .onUpdate((event) => {
            if (event.translationX >= 15) {
                settingsBarPosition.value = currentPosition.value + event.translationX
            }

        })
        .onEnd((event) => {
            if (event.velocityX >= 10) {
                settingsBarPosition.value = withTiming(0, {duration: 200})
                runOnJS(switchSettingsOn)()
            } else {
                settingsBarPosition.value = withTiming(-300, {duration: 200})
            }

        })
        // .manualActivation(!isHome)
        // Only activate if the user moves horizontally
        // beyond ±15px (example threshold)
        .activeOffsetX([-4, 4])

        // Fail if the user drags vertically more than ±10px
        .failOffsetY([-4, 4]);


    return (

        <View className="flex flex-1 w-screen">
            {/*<GestureDetector gesture={(isHome ? panHandler : emptyPan)}>*/}
            <GestureDetector gesture={panHandler}>
                <View className="flex-1 w-screen">
                    <Stack screenOptions={{headerShown: false, unmountOnBlur: true}}>
                        <Stack.Screen name="index"
                                      options={{headerShown: false, animation: 'default'}}/>
                        <Stack.Screen name="home"/>
                        <Stack.Screen name="maps/index" options={{
                            presentation: 'containedTransparentModal',
                            animation: 'none'
                        }}/>
                        <Stack.Screen name="businessProfile/[id]" options={{
                            presentation: 'containedTransparentModal',
                            animation: 'none'
                        }}/>
                        <Stack.Screen name="cardsView/activeCampaign" options={{
                            presentation: 'containedTransparentModal',
                            animation: 'none'
                        }}/>
                        <Stack.Screen name="cardsView/activeCollector" options={{
                            presentation: 'containedTransparentModal',
                            animation: 'none'
                        }}/>
                        <Stack.Screen name="cardsView/activePromotion" options={{
                            presentation: 'containedTransparentModal',
                            animation: 'none'
                        }}/>
                        <Stack.Screen name="cardsView/collector" options={{
                            presentation: 'containedTransparentModal',
                            animation: 'none'
                        }}/>
                        <Stack.Screen name="cardsView/voucher" options={{
                            presentation: 'containedTransparentModal',
                            animation: 'none'
                        }}/>
                        <Stack.Screen name="settings/editProfile" options={{
                            // presentation: 'transparentModal',
                            animation: 'slide_from_right'
                        }}/>
                        <Stack.Screen name="settings/teams" options={{
                            // presentation: 'transparentModal',
                            animation: 'slide_from_right'
                        }}/>
                        <Stack.Screen name="settings/about" options={{
                            // presentation: 'transparentModal',
                            animation: 'slide_from_right'
                        }}/>
                    </Stack>
                </View>
            </GestureDetector>


            <GestureDetector gesture={settingsPanHandler}>
                <Animated.View style={settingsBarAnimatedStyle}
                               className='w-[300] h-full bg-white absolute top-0 left-0 border-r border-ship-gray-200'>
                    <OutsidePressHandler
                        disabled={!isAccountSettings}
                        onOutsidePress={() => {
                            switchSettingsOff()
                        }}
                    >
                        <AccountSettings switchSettingsOff={switchSettingsOff}/>
                    </OutsidePressHandler>
                </Animated.View>
            </GestureDetector>
        </View>


    );
}
