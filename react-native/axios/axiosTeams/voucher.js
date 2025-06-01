import AxiosBase from "../_base";

export const UseVoucherTeams = async (voucher_token, business_owner_id, token) => {
  const res = await AxiosBase.post(
    `/voucher-card/use/`,
    { voucher_token: voucher_token, business_owner_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const GetVoucher = async (voucher_token, business_owner_id, token) => {
  const res = await AxiosBase.post(
    `/voucher-card/get/`,
    { voucher_token: voucher_token, business_owner_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
