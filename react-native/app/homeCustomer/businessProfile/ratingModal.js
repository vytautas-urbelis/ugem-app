import BusinessProfile from "../../../components/businessProfile";
import {router, useLocalSearchParams, usePathname} from "expo-router";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import Animated, {runOnJS, withTiming} from "react-native-reanimated";
import {View} from "react-native";
import ModalRoutBack from "../../../components/smallComponents/modalRoutBack";

const BusinessProfilePage = () => {
    const {businessID} = useLocalSearchParams()
    const {fromMap} = useLocalSearchParams()
    const {id} = useLocalSearchParams()
    const pathLocation = usePathname()
    console.log(pathLocation, id)

    const routerBack = () => {
        router.back()
    }

    const panHandler = Gesture.Pan()
        .onUpdate((event) => {
            console.log('vytis');
            if (event.translationX > 15 && event.translationX < 17) {
                runOnJS(routerBack)()
            }

        })
        .onEnd((event) => {

            console.log("panGestureHandler", event.velocityX);
            // // lastPosition.value = event.translationX + lastPosition.value;
            // if (event.velocityX >= 10) {
            //     settingsBarPosition.value = withTiming(0, {duration: 200})
            //     runOnJS(switchSettingsOn)()
            // } else {
            //     settingsBarPosition.value = withTiming(-300, {duration: 200})
            // }

        })
        // Only activate if the user moves horizontally
        // beyond ±15px (example threshold)
        .activeOffsetX([-4, 4])

        // Fail if the user drags vertically more than ±10px
        .failOffsetY([-4, 4]);

    return (

        // <GestureDetector gesture={panHandler}>
        //     <Animated.View collapsable={false}
        //                    className={'flex-1 w-screen'}>
        <ModalRoutBack component={
            <BusinessProfile
                businessId={businessID}
                fromMap={fromMap}/>}>
        </ModalRoutBack>
    )
    //     </Animated.View>
    // </GestureDetector>)
}

export default BusinessProfilePage