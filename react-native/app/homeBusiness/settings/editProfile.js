import React from "react";
import EditProfile from "../../../components/accountBusiness/settings/editProfile";
import PageRoutBack from "../../../components/smallComponents/pageRoutBack";

export default function Home() {
    return (
        <>
            <PageRoutBack component={
                <EditProfile/>}>
            </PageRoutBack>
        </>
    );
}
