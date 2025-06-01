import {StyleSheet, View} from "react-native";

import * as Haptics from "expo-haptics";
import {colors} from "../../../../../constants/colors";

import CHECK from "../../../../../assets/stamps/check.svg";
import APPLE from "../../../../../assets/stamps/apple.svg";
import BEER from "../../../../../assets/stamps/beer.svg";
import BOWL from "../../../../../assets/stamps/bowl.svg";
import BURGER from "../../../../../assets/stamps/burger.svg";
import COFFEE from "../../../../../assets/stamps/coffee.svg";
import HOTDOG from "../../../../../assets/stamps/hotdog.svg";
import ICECREAM from "../../../../../assets/stamps/ice-cream.svg";
import PIZZA from "../../../../../assets/stamps/pizza.svg";
import SMILE from "../../../../../assets/stamps/smile.svg";
import STAR from "../../../../../assets/stamps/star.svg";
import {GestureHandlerRootView, ScrollView, Pressable} from "react-native-gesture-handler";

const StampPicker = ({selectedStamp, setSelectedStamp}) => {
    // Function to select stamp design
    const selectStamp = (design) => {
        setSelectedStamp(design);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    };

    return (
        <GestureHandlerRootView>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                nestedScroll={true}
                horizontal={true}
                //   style={styles.shadowGray}
                className="mt-7 rounded-lg bg-white flex-row">
                <View className={`w-20 border-2 ${selectedStamp === 1 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                <Pressable
                    onPress={() => {
                        selectStamp(1);
                    }}
                    className={`w-20 border-2 ${selectedStamp === 1 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                    <CHECK width={60} height={70}
                           fill={selectedStamp === 1 ? colors.shamrock["600"] : colors["ship-gray"]["300"]}/>
                </Pressable>
                </View>
                <View className={`w-20 border-2 ${selectedStamp === 2 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                <Pressable
                    onPress={() => {
                        selectStamp(2);
                    }}
                    className={`w-20 border-2 ${selectedStamp === 2 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                    <APPLE width={60} height={70}
                           fill={selectedStamp === 2 ? colors.shamrock["600"] : colors["ship-gray"]["300"]}/>
                </Pressable>
                    </View>
                    <View className={`w-20 border-2 ${selectedStamp === 3 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                <Pressable
                    onPress={() => {
                        selectStamp(3);
                    }}
                    className={`w-20 border-2 ${selectedStamp === 3 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                    <BEER width={60} height={70}
                          fill={selectedStamp === 3 ? colors.shamrock["600"] : colors["ship-gray"]["300"]}/>
                </Pressable>
                    </View>
                <View className={`w-20 border-2 ${selectedStamp === 4 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                <Pressable
                    onPress={() => {
                        selectStamp(4);
                    }}
                    className={`w-20 border-2 ${selectedStamp === 4 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                    <BOWL width={60} height={70}
                          fill={selectedStamp === 4 ? colors.shamrock["600"] : colors["ship-gray"]["300"]}/>
                </Pressable></View>
                <View className={`w-20 border-2 ${selectedStamp === 5 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                <Pressable
                    onPress={() => {
                        selectStamp(5);
                    }}
                    className={`w-20 border-2 ${selectedStamp === 5 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                    <BURGER width={60} height={70}
                            fill={selectedStamp === 5 ? colors.shamrock["600"] : colors["ship-gray"]["300"]}/>
                </Pressable>
                    </View>
                <View className={`w-20 border-2 ${selectedStamp === 6 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                <Pressable
                    onPress={() => {
                        selectStamp(6);
                    }}
                    className={`w-20 border-2 ${selectedStamp === 6 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                    <COFFEE width={60} height={70}
                            fill={selectedStamp === 6 ? colors.shamrock["600"] : colors["ship-gray"]["300"]}/>
                </Pressable>
                    </View>
                <View className={`w-20 border-2 ${selectedStamp === 7 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                <Pressable
                    onPress={() => {
                        selectStamp(7);
                    }}
                    className={`w-20 border-2 ${selectedStamp === 7 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                    <HOTDOG width={60} height={70}
                            fill={selectedStamp === 7 ? colors.shamrock["600"] : colors["ship-gray"]["300"]}/>
                </Pressable>
                    </View>
                <View className={`w-20 border-2 ${selectedStamp === 8 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                <Pressable
                    onPress={() => {
                        selectStamp(8);
                    }}
                    className={`w-20 border-2 ${selectedStamp === 8 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                    <ICECREAM width={60} height={70}
                              fill={selectedStamp === 8 ? colors.shamrock["600"] : colors["ship-gray"]["300"]}/>
                </Pressable>
                    </View>
                <View className={`w-20 border-2 ${selectedStamp === 9 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                <Pressable
                    onPress={() => {
                        selectStamp(9);
                    }}
                    className={`w-20 border-2 ${selectedStamp === 9 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                    <PIZZA width={60} height={70}
                           fill={selectedStamp === 9 ? colors.shamrock["600"] : colors["ship-gray"]["300"]}/>
                </Pressable>
                    </View>
                <View className={`w-20 border-2 ${selectedStamp === 10 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                <Pressable
                    onPress={() => {
                        selectStamp(10);
                    }}
                    className={`w-20 border-2 ${selectedStamp === 10 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                    <SMILE width={60} height={70}
                           fill={selectedStamp === 10 ? colors.shamrock["600"] : colors["ship-gray"]["300"]}/>
                </Pressable>
                    </View>
                <View className={`w-20 border-2 ${selectedStamp === 11 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                <Pressable
                    onPress={() => {
                        selectStamp(11);
                    }}
                    className={`w-20 border-2 ${selectedStamp === 11 ? "border-shamrock-600" : "border-ship-gray-200"}  items-center justify-center rounded-lg mr-2`}>
                    <STAR width={60} height={70}
                          fill={selectedStamp === 11 ? colors.shamrock["600"] : colors["ship-gray"]["300"]}/>
                </Pressable>
                    </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
};

export default StampPicker;

const styles = StyleSheet.create({
    shadowGray: {
        shadowColor: colors["ship-gray"]["700"],
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 2,
    }
});
