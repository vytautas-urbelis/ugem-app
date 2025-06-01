import {FlatList, Pressable, ScrollView, Text, View} from "react-native";
import {SeacrhInputComponent} from "../../smallComponents/textInput";
import {useEffect, useState} from "react";
import {GetActiveVouchers} from "../../../axios/axiosCustomer/voucher";
import Voucher from "./activeVoucher";

import NoVouchers from "./voucherView/noVouchers";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../MMKV/control";
import {authStorage} from "../../../MMKV/auth";
import {Modal, SlideAnimation} from "react-native-modals";
import BusinessProfile from "../../businessProfile";

const VoucherTab = () => {
    const [searchValue, setSearchValue] = useState("");
    const [vouchers, setVouchers] = useState([]);
    const [debouce, setDebounce] = useState(0);
    const [loader, setLoader] = useState(true);
    const [isBusinessProfile, setIsBusinessProfile] = useState(false);
    const [businessId, setBusinessId] = useState(null);

    const accessToken = authStorage.getString("accessToken");
    const [refreshVouchers, setRefreshVouchers] = useMMKVBoolean("refreshVouchers", controlStorage);

    useEffect(() => {
        let isMounted = true;
        setLoader(true);
        clearTimeout(timeoutId);
        const timeoutId = setTimeout(async () => {
            try {
                if (isMounted) {
                    const vouchers = await GetActiveVouchers(accessToken, searchValue);
                    setVouchers(vouchers);
                    setDebounce(500);
                }
            } catch (error) {
                if (isMounted) {
                    alert("There is a connection problem!", error);
                }
            } finally {
                if (isMounted) {
                    setLoader(false);
                }
            }
        }, debouce);

        return () => clearTimeout(timeoutId);
    }, [searchValue, refreshVouchers]);

    return (
        <View className="flex-1 items-center justify-start w-full px-2">
            <View className="w-full mb-3 ">
                <SeacrhInputComponent loader={loader} setValue={setSearchValue} placeholder={"Search for ..."}
                                      value={searchValue}/>
            </View>
            {vouchers.length === 0 && !loader ? (
                <NoVouchers/>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    className="w-full flex-1"
                    data={vouchers} // Array of data to display
                    renderItem={({item, index}) => (
                        <Pressable>
                            <Voucher
                                setIsBusinessProfile={setIsBusinessProfile}
                                setBusinessId={setBusinessId}
                                setSearchValue={setSearchValue}
                                voucher={item}
                                index={index}
                            />
                        </Pressable>
                    )}
                    keyExtractor={(item, index) => index.toString()} // Unique key for each item
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

export default VoucherTab;
