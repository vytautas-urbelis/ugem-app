import React from "react";
import Teams from "../../../components/accountBusiness/settings/teams";
import PageRoutBack from "../../../components/smallComponents/pageRoutBack";
import ClosedCampaigns from "../../../components/accountBusiness/settings/closedCampaigns";
import ClosedPromotions from "../../../components/accountBusiness/settings/closedPromotions";

export default function Home() {
    return (
        <>
            <PageRoutBack component={
                <ClosedPromotions/>}>
            </PageRoutBack>
        </>
    );
}
