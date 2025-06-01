import {FlatList, Pressable, ScrollView, View} from "react-native";
import {SeacrhInputComponent} from "../../smallComponents/textInput";
import {useEffect, useState} from "react";
import Collector from "./activeCollector";

import NoVouchers from "./collectorView/noCollectors";
import {GetCollectors} from "../../../axios/axiosCustomer/collector";
import {authStorage} from "../../../MMKV/auth";
import {err} from "react-native-svg";
import BusinessProfile from "../../businessProfile";
import {Modal, SlideAnimation} from "react-native-modals";

const CollectorsTab = () => {
    const [searchValue, setSearchValue] = useState("");
    const [collectors, setCollectors] = useState([]);
    const [debouce, setDebounce] = useState(0);
    const [loader, setLoader] = useState(true);
    const [isBusinessProfile, setIsBusinessProfile] = useState(false);
    const [businessId, setBusinessId] = useState(null);

    const [collector, setCollector] = useState([]);
    const accessToken = authStorage.getString("accessToken");

    useEffect(() => {
        let isMounted = true;
        setLoader(true);
        clearTimeout(timeoutId);
        const timeoutId = setTimeout(async () => {
            try {
                if (isMounted) {
                    const vouchers = await GetCollectors(accessToken, searchValue);
                    setCollectors(vouchers);
                    setDebounce(500);
                }
            } catch (error) {
                if (isMounted) {
                    alert("There is a connection problem!");
                }
            } finally {
                if (isMounted) {
                    setLoader(false);
                }
            }
        }, debouce);

        return () => {
            clearTimeout(timeoutId)
            isMounted = false;
        };
    }, [searchValue]);

    return (
        <View className="flex-1 items-center justify-start w-full px-2">
            <View className="w-full mb-3">
                <SeacrhInputComponent loader={loader} setValue={setSearchValue} placeholder={"Search for ..."}
                                      value={searchValue}/>
            </View>
            {collectors.length === 0 && !loader ? (
                <NoVouchers/>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    className="w-full flex-1"
                    data={collectors} // Array of data to display
                    renderItem={({item, index}) => (
                        <Pressable>
                            <Collector setIsBusinessProfile={setIsBusinessProfile} setBusinessId={setBusinessId}
                                       collector={item} index={index}/>
                        </Pressable>
                    )}
                    keyExtractor={(item, index) => {
                        return index.toString();
                    }} // Unique key for each item
                ></FlatList>
            )}
            <Modal
                key={"businessProfileFromVoucherModal"}
                style={{zIndex: 2}}
                visible={isBusinessProfile}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }>
                <BusinessProfile businessId={businessId} setIsBusinessProfile={setIsBusinessProfile}/>
            </Modal>
        </View>
    );
};

export default CollectorsTab;
