import AxiosBase from "../_base";

export const VerifyCustomer = async (jwt, token) => {
  const res = await AxiosBase.post(
    `/customer-card/verify-customer/`,
    { card_token: jwt },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const ValidateCard = async (campaign_id, value_count, secret_key, token) => {
  const res = await AxiosBase.post(
    `/collector-card/validate/`,
    { campaign_id, value_count, secret_key },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
