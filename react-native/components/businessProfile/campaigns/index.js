import { FlatList, Pressable, ScrollView, View } from "react-native";
import { useEffect, useState } from "react";

import { authStorage } from "../../../MMKV/auth";
import { GetBusinessCampaignsForProfile } from "../../../axios/axiosCustomer/business";
import ActiveCampaign from "./activeCampaigns";
import ActiveCollector from "./activeCollector";

const ActiveCampaignsView = ({ businessId }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loader, setLoader] = useState(true);
  const accessToken = authStorage.getString("accessToken");

  useEffect(() => {
    setLoader(true);
    const fetchActiveCampaigns = async () => {
      try {
        const activeCampaigns = await GetBusinessCampaignsForProfile(businessId, accessToken);
        setCampaigns(activeCampaigns);
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    };

    fetchActiveCampaigns();
  }, []);

  return (
    <View className="flex-1 items-center justify-start w-full mt-5 ">
      {campaigns.length === 0 && !loader ? (
        <></>
      ) : (
        <View className="w-full">
          {campaigns.map((campaign, index) => (
            <>
              {Object.keys(campaign.collector).length !== 0 ? (
                <ActiveCollector key={campaign.id} campaign={campaign} index={index}></ActiveCollector>
              ) : (
                <ActiveCampaign key={campaign.id} campaign={campaign} index={index}></ActiveCampaign>
              )}
            </>
          ))}
        </View>
      )}
    </View>
  );
};

export default ActiveCampaignsView;
