import {useEffect, useState} from "react";
import Modal, {SlideAnimation} from "react-native-modals";
import {authStorage} from "../../MMKV/auth";
import {router} from "expo-router";
import SwitchScreen from "./switchScreen";
import {View} from "react-native";
import {controlStorage} from "../../MMKV/control";
import {GetMeUser} from "../../axios/axiosBusiness/businessAuth";
import {saveBusinessMMKV} from "../../MMKV/mmkvBusiness/user";
import {getCustomerMMKV} from "../../MMKV/mmkvCustomer/user";
import CreateBusinessUserProifile from "./createBusinessProfile";
import {saveTeamProfileMMKV} from "../../MMKV/mmkvTeams";
import {useMMKVBoolean} from "react-native-mmkv";

const SwitchToBusiness = ({setIsSwitchProfiles}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [createBusinessProfile, setCreateBusinessProfile] = useState(false);
    const [activeWebSockets, setActiveWebSockets] = useMMKVBoolean("activeWebSockets", controlStorage);

    const accessToken = authStorage.getString("accessToken");
    const customerUser = getCustomerMMKV();
    const email = customerUser.email;

    useEffect(() => {
        // setIsLoading(true);
        const switchingToBusiness = async () => {
            try {
                const businessUser = await GetMeUser(accessToken);
                saveBusinessMMKV(businessUser);
                saveTeamProfileMMKV("");
                controlStorage.set("businessIsLogedIn", true);
                controlStorage.set("customerIsLogedIn", false);
                controlStorage.set("teamProfile", false);
                setActiveWebSockets(false)
                router.replace("homeBusiness");
                // closeSettings()
            } catch (error) {
                console.log(error);
                console.log(error.response.data);
                if (error.response.data === "User don't have Business profile.") {
                    console.log('atidarom')
                    setCreateBusinessProfile(true);
                }
            } finally {
                // setIsLoading(false);
            }
        };
        setTimeout(() => {
            switchingToBusiness();
        }, 500);
    }, [refresh]);
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
            <Modal
                key={200}
                style={{zIndex: 2}}
                visible={createBusinessProfile}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <View className="flex-1 w-screen h-screen">
                    <CreateBusinessUserProifile
                        setRefresh={setRefresh}
                        setCreateBusinessProfile={setCreateBusinessProfile}
                        setIsSwitchProfiles={setIsSwitchProfiles}
                        accessToken={accessToken}
                    />
                </View>
            </Modal>
        </>
    );
};

export default SwitchToBusiness;