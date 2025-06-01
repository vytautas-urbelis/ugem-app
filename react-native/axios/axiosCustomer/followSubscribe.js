import AxiosBase from "../_base";

export const GetBusinessOnScan = async (business_qr, accessToken) => {
  const res = await AxiosBase.post(
    "/customer/get-business-scann/",
    {
      business_qr,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const GetBusinessJustScanned = async (email, business_id) => {
  console.log(email, business_id);
  const res = await AxiosBase.post(`/business/user/${business_id}/`, {
    email,
  });
  return res.data;
};
