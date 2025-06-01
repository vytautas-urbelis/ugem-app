import {View} from "react-native";
import {Redirect} from "expo-router";
import React from "react";

export default function Home() {

    return (
        <>
            <View className="flex-1 items-center justify-center">
                <Redirect href="homeCustomer/home/cards"/>
                {/*<Cards/>*/}
            </View>
        </>
    );
}
