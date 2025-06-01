import {View} from "react-native";
import React from "react";
import ActiveCollectorView from "../../../components/businessProfile/campaigns/collectorView";
import {getCurrentCampaignMMKV} from "../../../MMKV/mmkvCustomer/campaigns";
import ModalRoutBack from "../../../components/smallComponents/modalRoutBack";
import CampaignView from "../../../components/businessProfile/campaigns/campaignView";

export default function ActiveCollectorDef() {
    const campaign = getCurrentCampaignMMKV()
    return (
        <>
            <ModalRoutBack component={
                <ActiveCollectorView campaign={campaign}/>}>
            </ModalRoutBack>
        </>
    );
}
