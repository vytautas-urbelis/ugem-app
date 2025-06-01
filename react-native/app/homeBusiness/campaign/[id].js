import React from "react";
import PageRoutBack from "../../../components/smallComponents/pageRoutBack";
import {useLocalSearchParams} from "expo-router";
import CampaignView from "../../../components/accountBusiness/campaign";
import {getCurrentCampaignMMKV} from "../../../MMKV/mmkvCustomer/campaigns";

export default function Home() {
    const {id} = useLocalSearchParams()
    const campaign = getCurrentCampaignMMKV()
    return (
        <>
            <PageRoutBack component={
                <CampaignView campaign={campaign}/>}>
            </PageRoutBack>
        </>
    );
}
