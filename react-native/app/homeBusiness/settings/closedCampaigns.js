import React from "react";
import PageRoutBack from "../../../components/smallComponents/pageRoutBack";
import ClosedCampaigns from "../../../components/accountBusiness/settings/closedCampaigns";

export default function Home() {
    return (
        <>
            <PageRoutBack component={
                <ClosedCampaigns/>}>
            </PageRoutBack>
        </>
    );
}
