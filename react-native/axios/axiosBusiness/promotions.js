import AxiosBase from "../_base";

export const GetOpenPromotions = async (token) => {
  const res = await AxiosBase.get(`/promotion/open/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const GetClosedPromotions = async (token) => {
  const res = await AxiosBase.get(`/promotion/closed/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const CreatePromotion = async (data, token) => {
  const res = await AxiosBase.post(`/promotion/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updatePromotion = async (token, data, id) => {
  const res = await AxiosBase.patch(`/promotion/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// multipart/form-data
// application/json; charset=utf-8

// Accept: "application/json",
