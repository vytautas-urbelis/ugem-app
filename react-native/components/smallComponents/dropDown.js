import React, {useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {Dropdown} from "react-native-element-dropdown";

const DropdownComponent = ({itemList, setSelectedItem, selectedItem, label}) => {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <>
            {/*<View className=" w-full">*/}
            {/*    <Text className="mb-1 mt-2 text-ship-gray-700 w-full text-left text-xl font-semibold">{label}</Text>*/}
            {/*</View>*/}
            <View
                className="mb-4 border py-6 text-lg border-ship-gray-200 rounded-lg bg-ship-white">

                <Dropdown
                    className=""
                    style={{
                        backgroundColor: 'white',
                        paddingLeft: 16,
                        paddingRight: 16,
                        fontSize: 16
                    }}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    placeholderStyle={styles.placeholderStyle}
                    iconStyle={styles.iconStyle}
                    data={itemList}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? "Select" : "..."}
                    value={selectedItem}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                        setSelectedItem(item.value);
                        setIsFocus(false);
                    }}
                />
            </View>
            <Text
                className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">{label}
            </Text>

        </>
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 7.84,
        elevation: 10,
    },
    container: {
        padding: 16,
    },
    dropdown: {
        height: 40,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },

    placeholderStyle: {
        color: '#C0C0C0',
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
    },
});
