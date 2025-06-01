import {View} from "react-native";
import CHECKED from "../../../assets/svg/checkbox-checked.svg";
import UNCHECKED from "../../../assets/svg/checkbox-unchecked.svg";

export const Checkbox = ({size, color, isChecked}) => {
    return (
        <View>
            {isChecked ? (
                <>
                    <CHECKED fill={`${color}`} width={size} height={size}/>
                </>
            ) : (
                <>
                    <UNCHECKED fill={`${color}`} width={size} height={size}/>
                </>
            )}
        </View>
    );
};
