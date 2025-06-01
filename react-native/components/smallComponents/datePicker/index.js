import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TouchableOpacity } from "react-native";
import { Button } from "react-native";
import DatePicker from "react-native-date-picker";

const DatePickerComponent = ({ date, onDateChange, label,  }) => {
  // const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false);
  const dateToShow = `${date.toString().split(" ")[2]} ${date.toString().split(" ")[1]} ${date.toString().split(" ")[3]}`;

  return (
    <>
      <View style={styles.shadow} className="ml-3 mr-3 mt-3 rounded-xl bg-white">
        <View className="w-full">
          <Text className=" mt-2 ml-4 text-blue-500 w-full text-left text-xs">{label}</Text>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text className="mb-2 ml-4 text-sm">{dateToShow}</Text>
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

export default DatePickerComponent;
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 7.84,
    elevation: 10,
  },
});
