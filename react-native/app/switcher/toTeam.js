import {useEffect, useState} from "react";
import Modal, {SlideAnimation} from "react-native-modals";
import {router} from "expo-router";
import SwitchScreen from "./switchScreen";
import {View} from "react-native";
import {controlStorage} from "../../MMKV/control";
import {useMMKVBoolean} from "react-native-mmkv";

const SwitchToTeam = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeWebSockets, setActiveWebSockets] = useMMKVBoolean("activeWebSockets", controlStorage);

    useEffect(() => {
        // setIsLoading(true);
        const switchingToTeam = async () => {
            try {
                controlStorage.set("teamProfile", true);
                setActiveWebSockets(false)
                router.replace("homeTeam");
            } catch (error) {
                console.log(error);
            } finally {
                // setIsLoading(false);
            }
        };

        setTimeout(() => {
            switchingToTeam();
        }, 500);
    }, []);
    return (
        <>
            <Modal
                key={100}
                style={{zIndex: 2}}
                visible={isLoading}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <View className="flex-1 w-screen h-screen">
                    <SwitchScreen/>
                </View>
            </Modal>
        </>
    );
};

export default SwitchToTeam;