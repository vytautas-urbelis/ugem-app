import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {Text, View} from "react-native";
import {colors} from "../../../../constants/colors";
import {returnStamp} from "../../../../utils/stamps";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

const Stamp = ({collector, log, i}) => {

    const stampOpacity = useSharedValue(0);
    const stampX = useSharedValue(0);
    const stampY = useSharedValue(0);
    const scale = useSharedValue(0.5);

    const singleTap = Gesture.LongPress()
        .onBegin((event) => {
                stampY.value = withTiming(-10, {duration: 100})
                scale.value = withTiming(1, {duration: 100})
                stampOpacity.value = withTiming(1, {duration: 20})
            }
        ).onFinalize((event) => {
            stampOpacity.value = withTiming(0, {duration: 200})
            stampY.value = withTiming(0, {duration: 200})
            scale.value = withTiming(0.2, {duration: 200})
        })


    const stampDateStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: stampX.value}, {translateY: stampY.value}, {scale: scale.value}],
            opacity: stampOpacity.value
        }

    })

    return (<GestureDetector gesture={singleTap}>
        <View
            className="h-[60] w-[60] rounded-full m-3 ml-3 mr-3 items-center justify-center"
            key={log.id + i}
            style={{backgroundColor: colors["ship-gray"]["100"]}}
        >
            {returnStamp(collector.campaign.color, collector.campaign.stamp_design, 90)}
            <Animated.View style={stampDateStyle} className="absolute">
                <View className={'p-1 bg-white rounded-xl'}>
                    <Text
                        className={'text-2xl font-bold w-full text-ship-gray-600'}>{new Date(log.date_created).toLocaleDateString()}
                    </Text>
                </View>
            </Animated.View>
        </View>


    </GestureDetector>)
}

export default Stamp;
