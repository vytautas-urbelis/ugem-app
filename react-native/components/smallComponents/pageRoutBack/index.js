import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {router} from "expo-router";

const PageRoutBack = ({component}) => {
    const componentPositionX = useSharedValue(0);
    // const componentPositionY = useSharedValue(0);


    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: componentPositionX.value},
                // {translateY: componentPositionY.value}
            ],
        }
    })

    const closeComponent = () => {
        setTimeout(() => {router.dismiss()}, 100)
    }

    const panHandler = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationX >= 3) {
                componentPositionX.value = event.translationX
                // componentPositionY.value = event.translationY
            }
        })
        .onEnd((event) => {
            if (event.translationX >= 3) {
                if (event.velocityX >= 10) {
                    componentPositionX.value = withTiming(400, {duration: 100})
                    runOnJS(closeComponent)()
                } else {
                    componentPositionX.value = withTiming(0, {duration: 200})
                    // componentPositionY.value = withTiming(0, {duration: 200})
                }
            } else {
                componentPositionX.value = withTiming(0, {duration: 200})
                // componentPositionY.value = withTiming(0, {duration: 200})
            }

        })
        // Only activate if the user moves horizontally
        // beyond ±15px (example threshold)
        .activeOffsetX([-4, 4])

        // Fail if the user drags vertically more than ±10px
        .failOffsetY([-4, 4]);


    return (<>
        <GestureDetector gesture={panHandler}>
            <Animated.View collapsable={false} style={animatedStyle}
                           className='flex-1 w-screen bg-transparent'>
                {component}
            </Animated.View>
        </GestureDetector>
    </>)
}

export default PageRoutBack