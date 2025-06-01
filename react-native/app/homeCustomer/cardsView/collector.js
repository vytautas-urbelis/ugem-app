import {View} from "react-native";
import React from "react";
import CollectorView from "../../../components/accountCustomer/collectors/collectorView";
import {getCurrentCollectorMMKV} from "../../../MMKV/mmkvCustomer/collectors";
import ModalRoutBack from "../../../components/smallComponents/modalRoutBack";
import PromotionView from "../../../components/businessProfile/promotions/promotionView";

export default function Home() {
    const collector = getCurrentCollectorMMKV()
    return (
        <>
            <ModalRoutBack component={
                <CollectorView collector={collector}/>}>
            </ModalRoutBack>
        </>
    );
}
