import { View, Text, StyleSheet } from "react-native";
import { Platform } from "react-native";
import { getFontFamily } from "../../../utils/fontFamily";

// export const TitleText = ({ label, value }) => {
//   return (
//     <View className={`mr-3 ml-3  items-center rounded-xl`}>
//       <Text className=" text-gray-500 w-full pt-1 pl-3 text-left text-sm">{label}</Text>
//       <Text className="  w-full pl-3 text-left text-2xl">{value}</Text>
//     </View>
//   );
// };

// export const NormalText = ({ label, value }) => {
//   return (
//     <View className={`mr-3 ml-3  items-center rounded-xl`}>
//       <Text className=" text-gray-500 w-full pt-1 pl-3 text-left text-sm">{label}</Text>
//       <Text className="  w-full pl-3 text-center text-lg">{value}</Text>
//     </View>
//   );
// };

// export const NormalTextL = ({ label, value }) => {
//   return (
//     <View className={`mr-3 ml-3  items-center rounded-xl`}>
//       <Text className=" text-gray-500 w-full pb-1 pl-3 text-left text-sm">{label}</Text>
//       <Text className=" text-base w-full pl-3 text-left">{value}</Text>
//     </View>
//   );
// };

// export const SmallText = ({ label, value }) => {
//   return (
//     <View className={`mr-3 ml-3  items-left rounded-xl`}>
//       <Text className=" text-gray-500 w-full pt-1 pl-3 text-left text-xs">{label}</Text>
//       <Text className="  w-full pl-3 text-left text-sm">{value}</Text>
//     </View>
//   );
// };

export const TitleText = ({ label, value }) => {
  return (
    <View className={`items-start rounded-xl`}>
      <View className="pt-1 w-full">
        <TextFontRegular size={14} align={"left"} font={"light"}>
          {label}
        </TextFontRegular>
      </View>
      <View className="pt-1 w-full">
        <TextFontRegular size={20} align={"left"} font={"medium"}>
          {value}
        </TextFontRegular>
      </View>
    </View>
  );
};

export const ActiveVoucherTitleText = ({ label, value }) => {
  return (
    <View className={`items-start rounded-xl`}>
      <View className="pt-1 w-full">
        <TextFontRegular size={12} align={"left"} font={"light"}>
          {label}
        </TextFontRegular>
      </View>
      <View className="pt-1 w-full">
        <TextFontRegular size={14} align={"left"} font={"medium"}>
          {value}
        </TextFontRegular>
      </View>
    </View>
  );
};

export const NormalText = ({ label, value }) => {
  return (
    <View className={`m-3  items-center rounded-xl`}>
      <View className="pt-1 pl-3 w-full">
        <TextFontRegular size={14} align={"left"} font={"light"}>
          {label}
        </TextFontRegular>
      </View>
      <View className="pt-1 pl-3 w-full">
        <TextFontRegular size={16} align={"left"} font={"medium"}>
          {value}
        </TextFontRegular>
      </View>
    </View>
  );
};

export const NormalTextL = ({ label, value }) => {
  return (
    <View className={`m-3 items-center rounded-xl`}>
      <View className="pt-1 pl-3 w-full">
        <TextFontRegular size={14} align={"left"} font={"light"}>
          {label}
        </TextFontRegular>
      </View>
      <View className="pt-1 pl-3 w-full">
        <TextFontRegular size={16} align={"left"} font={"medium"}>
          {value}
        </TextFontRegular>
      </View>
    </View>
  );
};

export const SmallText = ({ label, value }) => {
  return (
    <View className={` items-center rounded-xl`}>
      <View className="pt-1 pl-3 w-full">
        <TextFontRegular size={14} align={"left"} font={"light"}>
          {label}
        </TextFontRegular>
      </View>
      <View className="pt-1 pl-3 w-full">
        <TextFontRegular size={16} align={"left"} font={"medium"}>
          {value}
        </TextFontRegular>
      </View>
    </View>
  );
};

export const VoucherBusinessText = ({ value }) => {
  return (
    <View className={` p-2 items-center rounded-xl bg-white`}>
      <Text className="flex-wrap  w-full pl-3 pr-3 text-center text-sm">{value}</Text>
    </View>
  );
};

export const VoucherNameText = ({ value }) => {
  return (
    <View className={` pt-2 pb-2 items-center rounded-xl bg-white`}>
      <View className="pt-1 pl-3 w-full">
        <TextFontRegular size={20} align={"left"} font={"bold"}>
          {value}
        </TextFontRegular>
      </View>
    </View>
  );
};

export const TextFontRegular = ({ children, size, color, align, font }) => {
  const fSize = parseInt(size);
  return (
    <Text
      className={`flex-wrap text-${size} text-${align}`}
      style={{ fontFamily: getFontFamily(true, font), color: color, fontSize: fSize }}>
      {children}
    </Text>
  );
};
