import {View} from "react-native";
import React from "react";
import {getCurrentCampaignMMKV} from "../../../MMKV/mmkvCustomer/campaigns";
import CampaignView from "../../../components/businessProfile/campaigns/campaignView";
import BusinessProfile from "../../../components/businessProfile";
import ModalRoutBack from "../../../components/smallComponents/modalRoutBack";

export default function ActiveCampaignDef() {
    const campaign = getCurrentCampaignMMKV()
    return (
        <>
            <ModalRoutBack component={
                <CampaignView campaign={campaign}/>}>
            </ModalRoutBack>
        </>
    );
}
