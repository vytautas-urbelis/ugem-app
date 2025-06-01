import AxiosBase from "../_base";

export const GetCollectors = async (token, search) => {
  const res = await AxiosBase.get(`/collector-card/customer/?search=${search}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const GetCollectorLogs = async (token, collector_id) => {
  const res = await AxiosBase.get(`/collector-card/collector-logs/${collector_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
