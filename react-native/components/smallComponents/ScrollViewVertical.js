import {View} from "react-native";
import {PanGestureHandler} from "react-native-gesture-handler";
import Animated, {useAnimatedGestureHandler} from "react-native-reanimated";
import {useRef} from "react";

const ScrollViewVertical = () => {

    const pages = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const panGestureHandler = (event) => {
        console.log("panGestureHandler", event.nativeEvent);
    }

    const scrollEvent = (event) => {
        console.log('scrollEvent', event.nativeEvent.contentOffset);
    }

    const scrollRef = useRef();

    return (
        <View className='w-screen h-[1200]'>
            <PanGestureHandler simultaneousHandlers={scrollRef}
                               waitFor={scrollRef}
                               onGestureEvent={panGestureHandler}
                // Only activate for horizontal swipes beyond ±30 px
                               activeOffsetX={[-30, 30]}
                // Fail if the user drags vertically beyond ±10 px
                               failOffsetY={[-10, 10]}>
                <Animated.ScrollView ref={scrollRef} onScroll={scrollEvent}>
                    <View className="h-full bg-yellow-50 w-screen">
                        {pages.map((page, index) =>

                            <View className='w-screen h-60' key={page}
                                  style={{backgroundColor: `rgba(0,0,256,0.${index + 1})`}}>

                            </View>
                        )}
                    </View>
                </Animated.ScrollView>
            </PanGestureHandler>
        </View>
    )
}

export default ScrollViewVertical