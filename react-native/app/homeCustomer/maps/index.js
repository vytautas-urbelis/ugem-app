import MapsTab from "../../../components/accountCustomer/maps";
import {useLocalSearchParams} from "expo-router";
import ModalRoutBack from "../../../components/smallComponents/modalRoutBack";

const Maps = () => {
    const {latitude, longitude, givenBusinessId} = useLocalSearchParams()
    return (
        // <ModalRoutBack component={<MapsTab latitude={latitude} longitude={longitude}
        //                                       givenBusinessId={givenBusinessId}/>}></ModalRoutBack>
    <MapsTab latitude={latitude} longitude={longitude} ivenBusinessId={givenBusinessId}/>
    )
};

export default Maps;
