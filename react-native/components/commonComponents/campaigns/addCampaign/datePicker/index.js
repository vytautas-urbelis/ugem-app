import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TouchableOpacity } from "react-native";
import { Button } from "react-native";
import DatePicker from "react-native-date-picker";
import { colors } from "../../../../../constants/colors";
import { AntDesign } from "@expo/vector-icons";

const DatePickerCampaign = ({ date, onDateChange, label }) => {
  // const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false);
  const dateToShow = `${date.toString().split(" ")[2]} ${date.toString().split(" ")[1]} ${date.toString().split(" ")[3]}`;

  return (
    <>
      <View style={styles.shadow} className="mt-7 rounded-lg bg-white">
        <View className="w-full">
          <TouchableOpacity className="flex-row justify-between items-center" onPress={() => setOpen(true)}>
            <View>
              <Text className=" mt-2 ml-4 text-shamrock-700 w-full text-left text-lg">{label}</Text>
              <Text className="mb-2 ml-4 font-bold text-shamrock-700 text-xl">{dateToShow}</Text>
            </View>
            <View className="mr-4">
              <AntDesign name="calendar" size={26} color={colors['ship-gray']['500']} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <DatePicker
        modal
        mode={"date"}
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          onDateChange(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default DatePickerCampaign;
const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors["ship-gray"]["700"],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 2,
  },
});
