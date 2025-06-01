import BusinessProfile from "../../../components/businessProfile";
import {useLocalSearchParams} from "expo-router";

const BusinessProfilePage = () => {
    const {businessID} = useLocalSearchParams()
    return (<BusinessProfile businessId={businessID} closeBusinessProfile={'s'} setIsBusinessProfile={'s'}/>)
}

export default BusinessProfilePage