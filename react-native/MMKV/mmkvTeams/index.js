import { MMKV } from "react-native-mmkv";

export const TeamsStorage = new MMKV({
  id: `TeamRequests`,
});

export const saveTeamRequestsMMKV = (array) => {
  try {
    const jsonString = JSON.stringify(array);
    TeamsStorage.set("requests", jsonString);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const getTeamRequestsMMKV = () => {
  try {
    const jsonString = TeamsStorage.getString("requests");
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
};

export const saveTeamProfileMMKV = (array) => {
  try {
    const jsonString = JSON.stringify(array);
    TeamsStorage.set("teamProfile", jsonString);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const getTeamProfileMMKV = () => {
  try {
    const jsonString = TeamsStorage.getString("teamProfile");
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
};
