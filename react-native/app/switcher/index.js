import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import SaveLoader from "../../components/smallComponents/smLoader";
import {GetProfiles} from "../../axios/axiosProfiles/profiles";
import {authStorage} from "../../MMKV/auth";
import {Entypo, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {getTeamProfileMMKV, saveTeamProfileMMKV} from "../../MMKV/mmkvTeams";
import {controlStorage} from "../../MMKV/control";
import SwitchToBusiness from "./toBusiness";
import * as Haptics from "expo-haptics";
import SwitchToTeam from "./toTeam";
import SwitchToCutomer from "./toCustomer";
import {colors} from "../../constants/colors";
import {MEDIA_URL} from "../../utils/CONST";

export default function SwitchProfile({setIsSwitchProfile, closeSettings}) {
    // State to manage loading indicator
    const [isLoading, setIsLoading] = useState(true);
    const [businessUserProfile, setBusinessUserProfile] = useState([]);
    const [customerUserProfile, setCustomerUserProfile] = useState([]);
    const [teamsUserProfiles, setTeamsUserProfiles] = useState([]);

    const accessToken = authStorage.getString("accessToken");
    const isTeamProfile = controlStorage.getBoolean("teamProfile");
    const isBusinessProfile = controlStorage.getBoolean("businessIsLogedIn");
    const isCustomerProfile = controlStorage.getBoolean("customerIsLogedIn");

    const teamProfile = getTeamProfileMMKV();


    useEffect(() => {
        setIsLoading(true); // Show loading indicator
        const getUserProfiles = async () => {
            try {
                const profiles = await GetProfiles(accessToken);
                setBusinessUserProfile(profiles.business_user_profile[0]);
                setCustomerUserProfile(profiles.customer_user_profile[0]);
                setTeamsUserProfiles(profiles.teams_user_profile);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        getUserProfiles();
    }, []);

    const switchProfile = (profile, team = null) => {
        team;
        if (profile === "business") {
            if (isBusinessProfile & !isTeamProfile) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                return setIsSwitchProfile(false);
            } else {
                // closeSettings();
                setSwitchToBusinessProfile(true);
                // setIsSwitchProfile(false);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        } else if (profile === "ugem") {
            if (isCustomerProfile & !isTeamProfile) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                return setIsSwitchProfile(false);
            } else {
                closeSettings();
                setIsSwitchProfile(false);
                setSwitchToCustomerProfile(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                // return setIsSwitchProfile(true);
            }
        } else if (profile === "team") {
            if (teamProfile) {
                if (isTeamProfile & (teamProfile.user_id === team.user_id)) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                    return setIsSwitchProfile(false);
                } else {
                    saveTeamProfileMMKV(team);
                    closeSettings();
                    setIsSwitchProfile(false);
                    setSwitchToTeamsProfile(true);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
            } else {
                saveTeamProfileMMKV(team);
                closeSettings();
                setIsSwitchProfile(false);
                setSwitchToTeamsProfile(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            // return setIsSwitchProfile(false);
        }
    };

    const [switchToBusinessProfile, setSwitchToBusinessProfile] = useState(false);
    const [switchToCustomerProfile, setSwitchToCustomerProfile] = useState(false);
    const [switchToTeamsProfile, setSwitchToTeamsProfile] = useState(false);

    return (
        <>
            {isLoading ? (
                <View className="flex w-full h-60 rounded-2xl  justify-center items-center bg-white  mb-8"></View>
            ) : (
                <View className="flex w-full rounded-2xl  justify-center items-center bg-white  mb-8">
                    {switchToBusinessProfile &&
                        <SwitchToBusiness setIsSwitchProfile={setIsSwitchProfile} closeSettings={closeSettings}
                                          key={1000}/>}
                    {switchToCustomerProfile && <SwitchToCutomer key={2000}/>}
                    {switchToTeamsProfile && <SwitchToTeam key={3000}/>}
                    {isLoading ? (
                        // Show loader while logout process is ongoing
                        <SaveLoader/>
                    ) : (
                        <>
                            {businessUserProfile ? <TouchableOpacity
                                    onPress={() => {
                                        switchProfile("business");
                                    }}
                                    className="items-center flex-row w-full mb-2">
                                    <View className="w-2/12">
                                        {businessUserProfile.logo ? (
                                            <Image
                                                // onLoad={() => setImageLoaded(true)}
                                                source={{uri: `${MEDIA_URL}${businessUserProfile.logo}`}}
                                                className="w-12 h-12 rounded-full mt-3 ml-4"
                                                alt="Logo"
                                            />
                                        ) : (
                                            <View
                                                className="w-12 h-12 rounded-full mt-3 ml-4 items-center justify-center bg-ship-gray-200">
                                                <Text
                                                    className="text-2xl font-semibold">{businessUserProfile.business_name.charAt(0).toUpperCase()}</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View className="pl-4 w-8/12 mt-3 items-start justify-center h-14">
                                        <Text className=" text-secondtext text-sm">Business Profile</Text>
                                        <Text
                                            className=" text-lg text-left font-semibold text-normaltext">{businessUserProfile.business_name}</Text>
                                    </View>
                                    <View className="items-end pr-6 mt-4 w-2/12">
                                        {isBusinessProfile & !isTeamProfile ? (
                                            <Ionicons name="checkmark-sharp" size={24} color="green"/>
                                        ) : (
                                            <MaterialCommunityIcons name="dots-horizontal" size={24}
                                                                    color={colors["ship-gray"]["300"]}/>
                                        )}
                                    </View>
                                </TouchableOpacity> :
                                <TouchableOpacity
                                    onPress={() => {
                                        switchProfile("business");
                                    }}
                                    className="items-center flex-row w-full mb-2">
                                    <View className="w-2/12">
                                        {customerUserProfile.avatar ? (
                                            <Image
                                                // onLoad={() => setImageLoaded(true)}
                                                source={{uri: `${MEDIA_URL}${customerUserProfile.avatar}`}}
                                                className="w-12 h-12 rounded-full mt-3 ml-4"
                                                alt="Logo"
                                            />
                                        ) : (
                                            <View
                                                className="w-12 h-12 rounded-full mt-3 ml-4 items-center justify-center bg-ship-gray-200">
                                                <Text
                                                    className="text-2xl font-semibold">{customerUserProfile.nickname.charAt(0).toUpperCase()}</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View className="pl-4 w-8/12 mt-3 items-start justify-center h-14">
                                        <Text className=" text-secondtext text-sm">Business Profile</Text>
                                        <Text className=" text-lg text-left font-semibold text-normaltext">Create
                                            business profile</Text>
                                    </View>
                                    <View className="items-end pr-6 mt-4 w-2/12">
                                        {isBusinessProfile & !isTeamProfile ? (
                                            <Ionicons name="checkmark-sharp" size={24} color="green"/>
                                        ) : (
                                            <MaterialCommunityIcons name="dots-horizontal" size={24}
                                                                    color={colors["ship-gray"]["300"]}/>
                                        )}
                                    </View>
                                </TouchableOpacity>}

                            <TouchableOpacity
                                onPress={() => {
                                    switchProfile("ugem");
                                }}
                                className="items-center flex-row w-full mb-2">
                                <View className="w-2/12">
                                    {customerUserProfile.avatar ? (
                                        <Image
                                            // onLoad={() => setImageLoaded(true)}
                                            source={{uri: `${MEDIA_URL}${customerUserProfile.avatar}`}}
                                            className="w-12 h-12 rounded-full mt-3 ml-4"
                                            alt="Logo"
                                        />
                                    ) : (
                                        <View
                                            className="w-12 h-12 rounded-full mt-3 ml-4 items-center justify-center bg-ship-gray-200">
                                            <Text
                                                className="text-2xl font-semibold">{customerUserProfile.nickname.charAt(0).toUpperCase()}</Text>
                                        </View>
                                    )}
                                </View>

                                <View className="pl-4 w-8/12 mt-3 items-start justify-center h-14">
                                    <Text className=" text-secondtext text-sm">uGem profile</Text>
                                    <Text
                                        className=" text-lg text-left font-semibold text-normaltext">{customerUserProfile.nickname}</Text>
                                </View>
                                <View className="items-end pr-6 mt-4 w-2/12">
                                    {isCustomerProfile & !isTeamProfile ? (
                                        <Ionicons name="checkmark-sharp" size={24} color="green"/>
                                    ) : (
                                        <MaterialCommunityIcons name="dots-horizontal" size={24}
                                                                color={colors["ship-gray"]["300"]}/>
                                    )}
                                </View>
                            </TouchableOpacity>
                            {teamsUserProfiles.length != 0 ? (
                                <>
                                    <View className="mt-2">
                                        <Text className="text-normaltext text-sm">Teams </Text>
                                    </View>
                                    {teamsUserProfiles.map((team_profile) => (
                                        <TouchableOpacity
                                            key={team_profile.user_id}
                                            onPress={() => {
                                                switchProfile("team", team_profile);
                                            }}
                                            className="items-center flex-row w-full mb-2">
                                            <View className="w-2/12">
                                                {team_profile.logo ? (
                                                    <Image
                                                        // onLoad={() => setImageLoaded(true)}
                                                        source={{uri: `${MEDIA_URL}${team_profile.logo}`}}
                                                        className="w-12 h-12 rounded-full mt-3 ml-4"
                                                        alt="Logo"
                                                    />
                                                ) : (
                                                    <View
                                                        className="w-12 h-12 rounded-full mt-3 ml-4 items-center justify-center bg-primary">
                                                        <Entypo name="shop" size={34} color="black"/>
                                                    </View>
                                                )}
                                            </View>

                                            <View className="pl-4 w-8/12 mt-3 items-start justify-center h-14">
                                                <Text className=" text-secondtext text-sm">Team Profile</Text>
                                                <Text
                                                    className=" text-lg text-left font-semibold text-normaltext">{team_profile.business_name}</Text>
                                            </View>
                                            <View className="items-end pr-6 mt-4 w-2/12">
                                                {teamProfile ? (
                                                    <>
                                                        {isTeamProfile & (teamProfile.user_id === team_profile.user_id) ? (
                                                            <Ionicons name="checkmark-sharp" size={24} color="green"/>
                                                        ) : (
                                                            <MaterialCommunityIcons name="dots-horizontal" size={24}
                                                                                    color={colors["ship-gray"]["300"]}/>
                                                        )}
                                                    </>
                                                ) : (
                                                    <MaterialCommunityIcons name="dots-horizontal" size={24}
                                                                            color={colors["ship-gray"]["300"]}/>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    )}
                </View>
            )}
        </>
    );
}

// Styles
const styles = StyleSheet.create({
    // Shadow style for button containers
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 2, height: 6},
        shadowOpacity: 0.3,
        shadowRadius: 20.84,
        elevation: 10,
    },
    // Base button style
    button: {
        width: "33%", // 1/3 of the container width
        borderColor: "#4B5563", // Equivalent to border-zinc-700
        margin: 12, // Margin equivalent to m-3
        padding: 12, // Padding equivalent to p-3
        height: 64, // Height equivalent to h-16
        alignItems: "center", // Align items to center
        justifyContent: "center", // Justify content to center
        borderWidth: 1, // Border width of 1
        borderRadius: 12, // Border radius for rounded corners
    },
    // Additional style for cancel button
    cancelButton: {
        width: "50%", // 1/2 of the container width
    },
});
