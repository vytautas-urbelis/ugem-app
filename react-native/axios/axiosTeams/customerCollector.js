import AxiosBase from "../_base";

export const GetCustomersCollector = async (campaign_id, secret_key, token) => {
  const res = await AxiosBase.post(
    `/collector-card/business/`,
    { campaign_id, secret_key },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
