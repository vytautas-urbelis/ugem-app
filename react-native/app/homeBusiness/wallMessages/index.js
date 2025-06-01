import React from "react";
import PageRoutBack from "../../../components/smallComponents/pageRoutBack";
import WallMessages from "../../../components/accountBusiness/wallMessages/allWallmessages/wallMessages";

export default function WallMessagesNav() {
    return (
        <>
            <PageRoutBack component={
                <WallMessages/>}>
            </PageRoutBack>
        </>
    );
}
