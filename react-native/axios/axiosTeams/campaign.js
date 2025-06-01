import AxiosBase from "../_base";

export const GetCollector = async (campaign_id, secret_key, token) => {
  const res = await AxiosBase.get(
    `/collector/enduser/${campaign_id}`,
    { secret_key: secret_key },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const ValidateCollector = async (campaign_id, secret_key, value_count, token) => {
  const res = await AxiosBase.post(
    "/collector/validate/",
    {
      secret_key: secret_key,
      value_count: value_count,
      campaign_id: campaign_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const GetOpenTeamCampaigns = async (token, businessID) => {
  const res = await AxiosBase.get(`/campaign/teams/open/${businessID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
