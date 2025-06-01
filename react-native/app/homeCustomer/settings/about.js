import React from "react";
import About from "../../../components/accountCustomer/settings/about";
import PageRoutBack from "../../../components/smallComponents/pageRoutBack";

export default function Home() {
    return (
        <>
            <PageRoutBack component={
                <About/>}>
            </PageRoutBack>
        </>
    );
}
