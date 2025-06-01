import AxiosBase from "../_base";

export const GetCustomerById = async (customer_id, token) => {
  try {
    const res = await AxiosBase.get(`/customer/user/${customer_id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "No user found");
  }
};

export const UseVoucher = async (voucher_token, token) => {
  const res = await AxiosBase.post(
    `/voucher-card/use/`,
    { voucher_token: voucher_token },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const GetVoucher = async (voucher_token, token) => {
  const res = await AxiosBase.post(
    `/voucher-card/get/`,
    { voucher_token: voucher_token },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const CreateVoucher = async (campaign_id, secret_key, token) => {
  const res = await AxiosBase.post(
    `/voucher-card/create/`,
    { campaign_id, secret_key },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
