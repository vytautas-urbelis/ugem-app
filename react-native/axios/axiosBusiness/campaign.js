import AxiosBase from "../_base";

// export const GetCustomerCollectors = async (secret_key, token) => {
//   const res = await AxiosBase.post(
//     `/collector-card/customer-to-validate/`,
//     { secret_key: secret_key },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );
//   return res.data;
// };

// export const ValidateCollector = async (campaign_id, secret_key, value_count, token) => {
//   const res = await AxiosBase.post(
//     "/collector/validate/",
//     {
//       secret_key: secret_key,
//       value_count: value_count,
//       campaign_id: campaign_id,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );
//   return res.data;
// };

export const GetOpenCampaigns = async (token) => {
    const res = await AxiosBase.get("/campaign/open/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const GetClosedCampaigns = async (token) => {
    const res = await AxiosBase.get("/campaign/closed/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const editCampaign = async (token, data, id) => {
    const res = await AxiosBase.patch(`/campaign/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const getCampaignById = async (token, id) => {
    const res = await AxiosBase.get(`/campaign/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const postCampaign = async (token, data) => {
    const res = await AxiosBase.post(`/campaign/`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const getVisitsData = async (token, id) => {
    const res = await AxiosBase.get(`/campaign/visits/last48/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
