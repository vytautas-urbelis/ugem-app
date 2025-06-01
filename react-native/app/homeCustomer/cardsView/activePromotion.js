import {View} from "react-native";
import React from "react";
import PromotionView from "../../../components/businessProfile/promotions/promotionView";
import {getCurrentPromotionBusinessProfileMMKV, getCurrentPromotionMMKV} from "../../../MMKV/mmkvCustomer/promotions";
import ModalRoutBack from "../../../components/smallComponents/modalRoutBack";
import ActiveCollectorView from "../../../components/businessProfile/campaigns/collectorView";

export default function ActiveCollectorDef() {
    const promotion = getCurrentPromotionMMKV()
    const businessProfile = getCurrentPromotionBusinessProfileMMKV()
    return (
        <>
            <ModalRoutBack component={
                <PromotionView promotion={promotion} businessProfile={businessProfile}/>}>
            </ModalRoutBack>
        </>
    );
}
