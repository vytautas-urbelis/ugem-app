

import { MMKV } from "react-native-mmkv";

export const teamsCampaigsStorage = new MMKV({
  id: `teamsCampaign`,
});


teamsCampaigsStorage.set('openCampaigns', '')
teamsCampaigsStorage.set('closedCampaigns', '')



export const saveTeamsCampaignsMMKV = ( key, array) => {
  try {
    const jsonString = JSON.stringify(array);
    teamsCampaigsStorage.set(key, jsonString);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const getTeamsCampaignsMMKV = (key) => {
  try {
    const jsonString = teamsCampaigsStorage.getString(key);
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};
