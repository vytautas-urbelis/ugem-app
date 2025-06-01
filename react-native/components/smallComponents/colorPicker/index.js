import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import ColorPicker, {HueSlider, Panel1} from 'reanimated-color-picker';
import {useSharedValue} from "react-native-reanimated";

export default function ColorPickerComponent({value, setColor, setIsSelectColor}) {
    const [showModal, setShowModal] = useState(false);

    // Note: 👇 This can be a `worklet` function.
    const onSelectColor = ({hex}) => {
        // do something with the selected color.
        setColor(hex);
    };

    const initColor = useSharedValue(value);

    return (
        <View className={"w-screen items-center py-10"}>
            <ColorPicker style={{width: '70%'}} value={initColor.value} onComplete={onSelectColor}>
                {/*<Preview/>*/}
                <Panel1/>
                <HueSlider/>
                {/*<OpacitySlider/>*/}
                {/*<Swatches/>*/}
            </ColorPicker>
            {/*<Button title='Ok' onPress={() => setIsSelectColor(false)}/>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});