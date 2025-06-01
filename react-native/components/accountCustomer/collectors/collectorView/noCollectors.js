import {Dimensions, Text, View} from "react-native";
import {useState} from "react";
import EMPTY from "../../../../assets/svg/empty.svg";

const NoVouchers = () => {
    const [imageLoaded, setImageLoaded] = useState(true);
    const imageWidth = Dimensions.get("window").width * 0.8
    // const scale = useSharedValue(0.9);
    // const opacity = useSharedValue(0);
    //
    // const animatedStyle = useAnimatedStyle(() => {
    //     return {
    //         transform: [{scale: scale.value}],
    //         opacity: opacity.value,
    //     };
    // });

    // useEffect(() => {
    //     if (imageLoaded) {
    //         scale.value = withTiming(1, {duration: 1000, easing: Easing.out(Easing.exp)});
    //         opacity.value = withTiming(1, {duration: 2000, easing: Easing.out(Easing.exp)});
    //     }
    //     return () => {
    //         cancelAnimation(scale);
    //         cancelAnimation(opacity)
    //     };
    // }, [imageLoaded]);

    return (
        <View className="flex-1 justify-start items-center flex">
            <View className={"opacity-40"}>
                <EMPTY width={imageWidth} height={imageWidth}/>
            </View>
            <Text className="absolute  top-5 text-2xl">Nothing found :(</Text>
        </View>
    );
};

export default NoVouchers;
