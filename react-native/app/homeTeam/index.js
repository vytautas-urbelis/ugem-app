import AccountTabTeam from "../../components/accountTeam";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../MMKV/control";
import {useEffect} from "react";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import OutsidePressHandler from "react-native-outside-press";
import AccountSettings from "../../components/accountTeam/settings";
import {View} from "react-native";
import Footer from "../../components/accountTeam/footer";

export default function Home() {
    const settingsBarPosition = useSharedValue(-300);
    const currentPosition = useSharedValue(-300);

    const [isAccountTeamSettings, setIsAccountTeamSettings] = useMMKVBoolean('isAccountTeamSettings', controlStorage)


    const settingsBarAnimatedStyle = useAnimatedStyle(() => {
        return {transform: [{translateX: settingsBarPosition.value}]}
    })
    const switchSettingsOn = () => {
        setTimeout(() => {
            setIsAccountTeamSettings(true)
        }, 220)

    }

    const switchSettingsOff = () => {
        settingsBarPosition.value = withTiming(-300, {duration: 300})
        currentPosition.value = -300
        setIsAccountTeamSettings(false)
    }

    useEffect(() => {
        if (isAccountTeamSettings) {
            settingsBarPosition.value = withTiming(0, {duration: 300})
        } else if (!isAccountTeamSettings) {
            settingsBarPosition.value = withTiming(-300, {duration: 300})
            currentPosition.value = -300
        }

    }, [isAccountTeamSettings]);


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

    const panHandler = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationX >= 15) {

                settingsBarPosition.value = currentPosition.value + event.translationX
            }

        })
        .onEnd((event) => {
            // lastPosition.value = event.translationX + lastPosition.value;
            if (event.velocityX >= 10) {
                settingsBarPosition.value = withTiming(0, {duration: 200})
                runOnJS(switchSettingsOn)()
            } else {
                settingsBarPosition.value = withTiming(-300, {duration: 200})
            }

        })
        // Only activate if the user moves horizontally
        // beyond ±15px (example threshold)
        .activeOffsetX([-4, 4])

        // Fail if the user drags vertically more than ±10px
        .failOffsetY([-4, 4]);
    return (
        <>

            <GestureDetector gesture={panHandler}>
                <View collapsable={false} className="flex-1 w-screen">
                    <AccountTabTeam/>
                    <Footer></Footer>
                </View>
            </GestureDetector>
            <GestureDetector gesture={settingsPanHandler}>
                <Animated.View style={settingsBarAnimatedStyle}
                               className='w-[300] h-full bg-white absolute top-0 left-0 border-r border-ship-gray-200'>
                    <OutsidePressHandler
                        disabled={!isAccountTeamSettings}
                        onOutsidePress={() => {
                            switchSettingsOff()

                        }}
                    >
                        <AccountSettings switchSettingsOff={switchSettingsOff}/>
                    </OutsidePressHandler>
                </Animated.View>
            </GestureDetector>
        </>
    );
}
