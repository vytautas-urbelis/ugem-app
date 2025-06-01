import {useLocalSearchParams} from "expo-router";
import OnCardScanned from "../../../../components/commonComponents/onCardScanned";

const BusinessProfilePage = () => {
    const {secretKey} = useLocalSearchParams()

    return (
        <OnCardScanned
            secretKey={secretKey}/>
    )
}

export default BusinessProfilePage