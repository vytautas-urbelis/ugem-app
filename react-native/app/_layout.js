import {Slot} from "expo-router";
// Import your global CSS file
import "../global.css";
import {SafeAreaProvider} from "react-native-safe-area-context";

import {GestureHandlerRootView} from "react-native-gesture-handler";
import {ModalPortal} from "react-native-modals";

import * as SplashScreen from "expo-splash-screen";
import {getCustomerMMKV} from "../MMKV/mmkvCustomer/user";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {iosClientId, webClientId} from "../constants/api";
import {EventProvider} from "react-native-outside-press";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../MMKV/control";
import {WebSocketProvider} from "../utils/webSockets";
import {StatusBar} from "expo-status-bar";
import {DeepLinkingProvider} from "../utils/deepLinkWrapper";

SplashScreen.preventAutoHideAsync();

export default function App() {
    GoogleSignin.configure({
        iosClientId: iosClientId,
        webClientId: webClientId, // From Google API Console
        offlineAccess: true, // If you want to access Google API on behalf of the user FROM YOUR SERVER
    });

    const customerProfile = getCustomerMMKV() ? getCustomerMMKV() : null;
    const secretKey = customerProfile ? customerProfile.customer_user_profile.secret_key : null;
    const [activeWebSockets, setActiveWebSockets] = useMMKVBoolean("activeWebSockets", controlStorage);

    // for local websockets testing
    // const URL = `ws://192.168.178.61:8000/ws/chanel/hLgU6xUJLY0eNzs/`;

    const URL = __DEV__ ? `wss://staging-develop.ugem.app/ws/chanel/${secretKey}/` : `wss://ugem.app/ws/chanel/${secretKey}/`;

    return (
        <SafeAreaProvider>
            <ModalPortal/>
            <GestureHandlerRootView>

                <EventProvider>
                    {/*<WebSockets customerProfile={customerProfile}/>*/}
                    <DeepLinkingProvider>
                        {activeWebSockets ? (
                            <WebSocketProvider url={URL}>
                                <StatusBar hidden={false}/>
                                <Slot/>
                            </WebSocketProvider>
                        ) : (
                            <><StatusBar hidden={false}/>
                                <Slot/>
                            </>
                        )}
                    </DeepLinkingProvider>
                </EventProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
