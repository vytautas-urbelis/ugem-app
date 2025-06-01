import OnVoucherExists from "../../../../components/commonComponents/onVoucherScanned";
import {getCurrentVoucherMMKV} from "../../../../MMKV/mmkvCustomer/vouchers";
import {controlStorage} from "../../../../MMKV/control";

const BusinessProfilePage = () => {
    const voucher = getCurrentVoucherMMKV()
    const scannedVoucher = controlStorage.getString("scannedVoucherQr");

    return (
        <OnVoucherExists
            voucher={voucher} scannedVoucher={scannedVoucher}/>
    )
}

export default BusinessProfilePage