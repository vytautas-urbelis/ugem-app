

import { MMKV } from "react-native-mmkv";

export const campaigsStorage = new MMKV({
  id: `campaign`,
});

export const campaigsVisitsStorage = new MMKV({
  id: `visits`,
});


campaigsStorage.set('openCampaigns', '')
campaigsStorage.set('closedCampaigns', '')



export const saveCampaignsMMKV = ( key, array) => {
  try {
    const jsonString = JSON.stringify(array);
    campaigsStorage.set(key, jsonString);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const getCampaignsMMKV = (key) => {
  try {
    const jsonString = campaigsStorage.getString(key);
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// export const saveClosedCampaignsMMKV = ( key, array) => {
//   try {
//     const jsonString = JSON.stringify(array);
//     campaigsStorage.set(key, jsonString);
//   } catch (error) {
//     console.error('Error saving data:', error);
//   }
// };

// export const getClosedCampaignsMMKV = (key) => {
//   try {
//     const jsonString = campaigsStorage.getString(key);
//     if (jsonString) {
//       return JSON.parse(jsonString);
//     }
//     return null;
//   } catch (error) {
//     console.error('Error retrieving data:', error);
//     return null;
//   }
// };

export const saveVisitsStats = ( key, array) => {
  try {
    const jsonString = JSON.stringify(array);
    campaigsVisitsStorage.set(key, jsonString);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const getVisitsStats = (key) => {
  try {
    const jsonString = campaigsVisitsStorage.getString(key);
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};