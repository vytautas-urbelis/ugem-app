import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SaveLoader from "../smLoader";

export const ButtonComponent = ({ value }) => {
  return (
    <View
      style={styles.shadow}
      className={` border-zinc-700 m-3 p-3 h-16 items-center justify-center border rounded-xl`}>
      <Text className="w-full text-base text-center">{value}</Text>
    </View>
  );
};

export const SubmitButton = ({ value, isSaving, handle }) => {
  return (
    <TouchableOpacity
      onPress={handle}
      style={styles.shadow}
      className={` mt-3 ml-3 mr-3 h-14 items-center bg-green-500 justify-center rounded-xl`}>
      {isSaving ? <SaveLoader /> : <Text className="w-full  text-center text-sm">{value}</Text>}
    </TouchableOpacity>
  );
};

export const SubmitButtonNew = ({ value, isSaving, handle }) => {
  return (
    <TouchableOpacity
      onPress={handle}
      style={styles.shadow}
      className={` mt-3 ml-3 mr-3 h-14 items-center bg-green-400 justify-center rounded-xl`}>
      {isSaving ? <SaveLoader /> : <Text className="w-full  text-center text-sm">{value}</Text>}
    </TouchableOpacity>
  );
};

export const CancelButton = ({ value, handle }) => {
  return (
    <TouchableOpacity
      onPress={() => handle(false)}
      style={styles.shadow}
      className={`mt-3 ml-3 mr-3 h-14 items-center  justify-center bg-white rounded-xl`}>
      <Text className="w-full  text-center text-base">{value}</Text>
    </TouchableOpacity>
  );
};

export const ButtonComponentNew = ({ value, setOnPress }) => {
  return (
    <TouchableOpacity
      onPress={() => setOnPress(false)}
      style={styles.shadow}
      className={` border-zinc-700 m-3 p-3 h-16 items-center justify-center border rounded-xl`}>
      <Text className="w-full  text-center text-base">{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 7.84,
    elevation: 10,
  },
});
