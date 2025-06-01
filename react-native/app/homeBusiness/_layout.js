import {Stack} from "expo-router";
import "../../global.css";
import {View} from "react-native";
import {RevenueCatProvider} from "../../utils/RCWrapper";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../MMKV/control";
import BusinessHeader from "../../components/accountBusiness/header";
import {authStorage} from "../../MMKV/auth";

export default function HomeLayout() {

    const [isRevenueCatConfigured, setIsRevenueCatConfigured] = useMMKVBoolean('isRevenueCatConfigured', controlStorage);

    const accessToken = authStorage.getString("accessToken");

    return (
        <RevenueCatProvider setIsRevenueCatConfigured={setIsRevenueCatConfigured}>
            {isRevenueCatConfigured ? <View className="flex flex-1 bg-white">
                {/*<GestureHandlerRootView>*/}
                <View className=""></View>
                {/*<Slot/>*/}
                <Stack screenOptions={{headerShown: false, unmountOnBlur: true}}>
                    <Stack.Screen name="index"/>
                    <Stack.Screen name="settings/editProfile"
                                  options={{headerShown: false, animation: "slide_from_right"}}/>
                    <Stack.Screen name="scann/index"
                                  options={{
                                      headerShown: false,
                                      animation: "slide_from_bottom",
                                      presentation: "containedModal"
                                  }}/>
                    {/*<Stack.Screen name="scann/onCardScanned/index"*/}
                    {/*              options={{headerShown: false, animation: "slide_from_bottom"}}/>*/}

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
                    <Stack.Screen name="settings/teams"
                                  options={{headerShown: false, animation: "slide_from_right"}}/>
                    <Stack.Screen name="settings/closedCampaigns"
                                  options={{headerShown: false, animation: "slide_from_right"}}/>
                    <Stack.Screen name="settings/closedPromotions"
                                  options={{headerShown: false, animation: "slide_from_right"}}/>
                    <Stack.Screen name="settings/about"
                                  options={{headerShown: false, animation: "slide_from_right"}}/>
                    <Stack.Screen
                        name="features/addCampaign"
                        options={{
                            headerShown: true,
                            headerBackTitle: "Home",
                            headerTitle: "Add Campaign",
                            animation: "slide_from_right",
                        }}
                    />
                    <Stack.Screen
                        name="features/addPromotion"
                        options={{
                            headerShown: true,
                            headerBackTitle: "Home",
                            headerTitle: "Add Promotion",
                            animation: "slide_from_right",
                        }}
                    />
                    <Stack.Screen name="wallMessages/index"
                                  options={{headerShown: false, animation: "slide_from_right"}}/>
                    <Stack.Screen name="campaign/[id]"
                                  options={{
                                      animation: "slide_from_right"
                                  }}/>
                </Stack>
                {/*</GestureHandlerRootView>*/}
            </View> : <BusinessHeader/>}

        </RevenueCatProvider>
    );
}
