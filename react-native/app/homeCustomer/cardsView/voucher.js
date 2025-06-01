import React from "react";
import VoucherView from "../../../components/accountCustomer/vouchers/voucherView";
import {getCurrentVoucherMMKV} from "../../../MMKV/mmkvCustomer/vouchers";
import ModalRoutBack from "../../../components/smallComponents/modalRoutBack";

export default function Home() {
    const voucher = getCurrentVoucherMMKV()
    return (
        <>
            <ModalRoutBack component={
                <VoucherView voucher={voucher}/>}>
            </ModalRoutBack>
        </>
    );
}
