import BusinessProfile from "../../../components/businessProfile";
import {useLocalSearchParams, usePathname} from "expo-router";
import ModalRoutBack from "../../../components/smallComponents/modalRoutBack";

const BusinessProfilePage = () => {
    const {businessID} = useLocalSearchParams()
    const {fromMap} = useLocalSearchParams()
    const {id} = useLocalSearchParams()
    const pathLocation = usePathname()

    return (

        <ModalRoutBack component={
            <BusinessProfile
                businessId={businessID}
                fromMap={fromMap}/>}>
        </ModalRoutBack>
    )
}

export default BusinessProfilePage