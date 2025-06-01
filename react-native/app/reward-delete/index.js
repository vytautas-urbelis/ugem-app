import React, {useEffect} from 'react';
import {View} from 'react-native';
import {getCustomerMMKV} from "../../MMKV/mmkvCustomer/user";
import {router} from "expo-router";

export default function Reward() {

    const customerUser = getCustomerMMKV()

    useEffect(() => {
        setTimeout(() => {
            router.push("/");
        }, 1000)


    }, [])

    console.log("Reward");


    return (
        <View className="flex flex-1 w-screen items-center justify-center">
            {/*<Text>Vale</Text>*/}
            {/*{customerUser ? <Redirect href="/"/> : <Redirect href="/"/>}*/}
            {/*<Redirect href="/"/>*/}
            {/*<View></View>*/}
        </View>
    );
}