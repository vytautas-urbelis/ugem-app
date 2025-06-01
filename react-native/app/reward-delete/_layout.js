import {Stack} from "expo-router";

export default function RewardLayout() {


    return (

        <Stack screenOptions={{headerShown: false, unmountOnBlur: true}}>
            <Stack.Screen name="index"
                          options={{
                              headerShown: false,
                              animation: "slide_from_bottom",
                              presentation: "containedModal"
                          }}/>
        </Stack>

    );
}
