import {Dimensions, StyleSheet, View} from "react-native";
import {useEffect, useState} from "react"; // Import React hooks
// Importing API calls and local storage functions for messages
// Importing custom components
import {GetOpenCampaigns} from "../../../axios/axiosBusiness/campaign";
import {getCampaignsMMKV, saveCampaignsMMKV} from "../../../MMKV/mmkvBusiness/campaigns";
import CampaignInAccount from "./campaign";
import {authStorage} from "../../../MMKV/auth";
import {controlStorage} from "../../../MMKV/control";
import {getTeamsCampaignsMMKV, saveTeamsCampaignsMMKV} from "../../../MMKV/mmkvTeams/campaigns";
import {getTeamProfileMMKV} from "../../../MMKV/mmkvTeams";
import {GetOpenTeamCampaigns} from "../../../axios/axiosTeams/campaign";

export default function CampaignsSection({onRefresh}) {
    // Check is business user or team user in controll
    const isUserLogedInAsTeam = controlStorage.getBoolean("teamProfile");

    // Fetching team profile from memory if exists
    const teamProfile = getTeamProfileMMKV();

    // User and business information
    const accessToken = authStorage.getString("accessToken");

    // Depend on user in control fetching open campaigns from memory
    const openCampaigns = isUserLogedInAsTeam ? getTeamsCampaignsMMKV("openCampaigns") : getCampaignsMMKV("openCampaigns");

    // State variables
    const [isLoading, setIsLoading] = useState(true); // Loading state for saving message

    // Fetch campaigns on component mount

    useEffect(() => {
        setIsLoading(true);
        const getCampaigns = async () => {
            try {
                if (isUserLogedInAsTeam) {
                    const campaigns = await GetOpenTeamCampaigns(accessToken, teamProfile.user_id); // Fetch wall messages
                    saveTeamsCampaignsMMKV("openCampaigns", campaigns); // Save campaigns locally
                } else {
                    const campaigns = await GetOpenCampaigns(accessToken); // Fetch wall messages
                    saveCampaignsMMKV("openCampaigns", campaigns); // Save campaigns locally
                }
            } catch (error) {
                console.log(error + "dddsnbfjshfgkwjehfkvwejhfvjwefhvj");
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 10);
            }
        };

        getCampaigns();
    }, []);

    // UI Component rendering
    return (
        <>
            {isLoading ? (
                <View className="h-screen"></View>
            ) : (
                <>
                    {openCampaigns.length !== 0 && (
                        <View className="w-full flex-1 mt-6">
                            <View className="h-full min-h-96">
                                {openCampaigns.map((campaign, index) => (
                                    <CampaignInAccount key={campaign.id} isUserLogedInAsTeam={isUserLogedInAsTeam}
                                                       campaign={campaign} index={index} onRefresh={onRefresh}/>
                                ))}
                            </View>
                        </View>
                    )}
                </>
            )}
        </>
    );
}

// Styles
const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 1.84,
        elevation: 2,
    },
    photoHeight: {
        height: Dimensions.get("window").width * 0.45,
    },
});
