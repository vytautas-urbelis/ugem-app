import {Stack} from "expo-router";
import "../../global.css";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function HomeLayout() {
    return (
        <>
            {/*<View style={{zIndex: 0}} className="flex flex-1 bg-background">*/}
            <GestureHandlerRootView>
                <Stack screenOptions={{headerShown: false, unmountOnBlur: true}}>
                    <Stack.Screen name="settings/about"
                                  options={{headerShown: false, animation: 'slide_from_right'}}/>
                    <Stack.Screen name="scann/index"
                                  options={{
                                      headerShown: false,
                                      animation: "slide_from_bottom",
                                      presentation: "containedModal"
                                  }}/>

                    <Stack.Screen name="scann/onCardScanned/success"
                                  options={{headerShown: false, animation: "slide_from_bottom"}}/>
                    <Stack.Screen name="scann/onCardScanned/failure"
                                  options={{headerShown: false, animation: "slide_from_bottom"}}/>
                    <Stack.Screen name="scann/onVoucherScanned/exists"
                                  options={{
                                      headerShown: false,
                                      animation: "slide_from_bottom",
                                      presentation: "containedModal"
                                  }}/>
                    <Stack.Screen name="scann/onVoucherScanned/success"
                                  options={{
                                      headerShown: false,
                                      animation: "slide_from_bottom",
                                      presentation: "containedModal"
                                  }}/>
                    <Stack.Screen name="scann/onVoucherScanned/failure"
                                  options={{
                                      headerShown: false,
                                      animation: "slide_from_bottom",
                                      presentation: "containedModal"
                                  }}/>
                </Stack>

                {/*<Slot/>*/}
            </GestureHandlerRootView>
            {/*</View>*/}
        </>
    );
}