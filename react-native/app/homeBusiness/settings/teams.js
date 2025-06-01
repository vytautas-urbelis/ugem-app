import React from "react";
import Teams from "../../../components/accountBusiness/settings/teams";
import PageRoutBack from "../../../components/smallComponents/pageRoutBack";

export default function Home() {
    return (
        <>
            <PageRoutBack component={
                <Teams/>}>
            </PageRoutBack>
        </>
    );
}
