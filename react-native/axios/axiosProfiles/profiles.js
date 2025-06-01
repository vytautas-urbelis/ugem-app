import AxiosBase from "../_base";

export const GetProfiles = async (token) => {
  const res = await AxiosBase.get("/user/profiles/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
