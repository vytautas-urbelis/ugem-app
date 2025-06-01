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

export const ValidateCardTeams = async (campaign_id, value_count, secret_key, business_owner_id, token) => {
  const res = await AxiosBase.post(
    `/collector-card/validate/`,
    { campaign_id, value_count, secret_key, business_owner_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
