import {useEffect, useState} from "react";
import Modal, {SlideAnimation} from "react-native-modals";
import {GetMeUser} from "../../axios/axiosCustomer/customerAuth";
import {saveCustomerMMKV} from "../../MMKV/mmkvCustomer/user";
import {authStorage} from "../../MMKV/auth";
import {router} from "expo-router";
import SwitchScreen from "./switchScreen";
import {View} from "react-native";
import {controlStorage} from "../../MMKV/control";
import {saveTeamProfileMMKV} from "../../MMKV/mmkvTeams";
import {useMMKVBoolean} from "react-native-mmkv";

const SwitchToCutomer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeWebSockets, setActiveWebSockets] = useMMKVBoolean("activeWebSockets", controlStorage);

    const accessToken = authStorage.getString("accessToken");

    useEffect(() => {
        // setIsLoading(true);
        const switchingToCutomer = async () => {
            try {
                const customerUser = await GetMeUser(accessToken);
                saveCustomerMMKV(customerUser);
                saveTeamProfileMMKV("");
                controlStorage.set("businessIsLogedIn", false);
                controlStorage.set("customerIsLogedIn", true);
                controlStorage.set("teamProfile", false);
                setIsLoading(false);
                if (activeWebSockets === false) {
                    setActiveWebSockets(true)
                }
                router.replace('homeCustomer/home/cards');
            } catch (error) {
                console.log(error);
            } finally {
                // setIsLoading(false);
            }
        };

        setTimeout(() => {
            switchingToCutomer();
        }, 500);
    }, []);
    return (
        <>
            <Modal
                key={'toCutomer-modal'}
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

export default SwitchToCutomer;