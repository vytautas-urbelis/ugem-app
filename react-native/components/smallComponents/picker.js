import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Icon, Picker, Typography } from "react-native-ui-lib"; //eslint-disable-line

const dropdown = require("../../assets/icons/chevronDown.png");

const PickerScreen = ({ setCollectorType, options }) => {
  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <View className="rounded-xl items-start">
        <Picker
          label={"Collector Type"}
          useWheelPicker
          //   value={selected}
          onChange={(nativePickerValue) => {
            setCollectorType(nativePickerValue);
          }}
          trailingAccessory={<Icon source={dropdown} />}
          items={options}
          initialValue={0} // Using a default value directly
        />
      </View>
    </ScrollView>
  );
};

export default PickerScreen;

export const CardPicker = ({ setCardType, options }) => {
  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <View className="rounded-xl items-start">
        <Picker
          label={"Card Type"}
          useWheelPicker
          //   value={selected}
          onChange={(nativePickerValue) => {
            setCardType(nativePickerValue);
          }}
          trailingAccessory={<Icon source={dropdown} />}
          items={options}
          initialValue={0} // Using a default value directly
        />
      </View>
    </ScrollView>
  );
};
