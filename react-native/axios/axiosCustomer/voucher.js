import AxiosBase from "../_base";

export const GetActiveVouchers = async (token, search) => {
  const res = await AxiosBase.get(`/voucher-card/customer/active/?search=${search}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const CheckIfVoucherIsUsed = async (voucher_id, token) => {
  const res = await AxiosBase.get(`/voucher-card/is-used/${voucher_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

export const IssuePromotionVoucher = async (promotion_id, token) => {
  const res = await AxiosBase.post(
    `/voucher-card/promotion-create/`,
    { promotion_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
