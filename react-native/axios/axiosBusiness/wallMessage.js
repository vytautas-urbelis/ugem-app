import AxiosBase from "../_base";

export const SendMessage = async (token, message) => {
  const res = await AxiosBase.post(
    `/business-wall/`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const GetWallMessages = async (token, amount = '') => {
  const res = await AxiosBase.get(`/business-wall/?amount=${amount}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const DeleteMessage = async (token, id) => {
  const res = await AxiosBase.delete(`/business-wall/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
