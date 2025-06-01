import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {campaigsStorage, campaigsVisitsStorage} from "../../../../MMKV/mmkvBusiness/campaigns";
import {getBusinessMMKV} from "../../../../MMKV/mmkvBusiness/user";
import {router} from "expo-router";
import {useState} from "react";
import {controlStorage} from "../../../../MMKV/control";
import SaveLoader from "../../../smallComponents/smLoader";
import {PasswordInputComponent} from "../../../smallComponents/textInput";
import {AuthenticateBusiness, DeleteBusinessAccount} from "../../../../axios/axiosBusiness/businessAuth";
import {NormalTextL} from "../../../smallComponents/textDisplay";
import {authStorage} from "../../../../MMKV/auth";

export default function DeleteAccount({setIsDeleteAccount}) {
    // State variables to manage loading, password input, and error message
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Retrieve business user and access token from storage
    const businessUser = getBusinessMMKV();
    const accessToken = authStorage.getString("accessToken");

    // Function to handle account deletion
    const handleAccountDeletion = async () => {
        setIsLoading(true);
        try {
            // Authenticate the business user with email and password
            await AuthenticateBusiness(businessUser.email, password);

            // If authentication is successful, delete the business account
            await DeleteBusinessAccount(accessToken);

            // Clear local storage
            campaigsStorage.set("openCampaigns", "");
            campaigsVisitsStorage.trim();
            authStorage.set("accessToken", "");
            authStorage.set("refreshToken", "");
            controlStorage.set("isLogedIn", false);

            // Close the modal and navigate to home screen
            setIsDeleteAccount(false);
            router.replace("/");
        } catch (error) {
            // Handle errors and set error message if password is incorrect
            if (error.response?.data?.detail === "No active account found with the given credentials") {
                setError("Entered password is incorrect.");
            }
            console.log(error.response?.data?.detail);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex w-full rounded-2xl h-screen justify-start pt-28 items-center bg-white">
            {/* Instruction Text */}
            <Text className="text-center text-base pl-6 pr-6 pb-2">Enter your password to delete your account.</Text>

            {/* Display User's Account Email */}
            <View className="w-full pr-2 pl-2">
                <NormalTextL label={"Account"} value={businessUser.email}/>
            </View>

            {/* Password Input Field */}
            <View className="w-full pr-2 pl-2 pb-1">
                <PasswordInputComponent label={"Password"} placeholder="Password" value={password}
                                        setValue={setPassword}/>
            </View>

            {/* Error Message */}
            {error ? <Text className="text-red-500 pt-2">{error}</Text> : null}

            {/* Action Buttons */}
            <View className="flex w-full items-center justify-center flex-row">
                {/* Delete Button */}
                <TouchableOpacity
                    className={`w-1/3 border-red-600 m-3 p-3 h-16 items-center justify-center border rounded-xl`}
                    onPress={handleAccountDeletion}>
                    <View style={styles.shadow}>
                        {isLoading ? (
                            <Text className="items-center justify-center">
                                <SaveLoader/>
                            </Text>
                        ) : (
                            <Text className="w-full text-red-600 text-base text-center">Delete</Text>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                    className={`w-1/2 border-zinc-700 m-3 p-3 h-16 items-center justify-center border rounded-xl`}
                    onPress={() => setIsDeleteAccount(false)}>
                    <View style={styles.shadow}>
                        <Text className="w-full text-base text-center">Cancel</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 2, height: 6},
        shadowOpacity: 0.3,
        shadowRadius: 20.84,
        elevation: 10,
    },
});
