import AxiosBase from "../_base";

export const GetReward = async (accessToken, campaignToken) => {
    const res = await AxiosBase.post(`/self-scan/`, {
        campaign_token: campaignToken,
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};
