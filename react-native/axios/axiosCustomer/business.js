import AxiosBase from "../_base";

export const GetBusiness = async (business_id, accessToken) => {
  const res = await AxiosBase.get(`/business/user/${business_id}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const FollowBusiness = async (business_id, accessToken) => {
  const res = await AxiosBase.post(
    `/customer/follow/toggle/`,
    { business_id },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const SubscriBusiness = async (business_id, accessToken) => {
  const res = await AxiosBase.post(
    `/customer/subscribe/toggle/`,
    { business_id },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const LikeWallMessage = async (message_id, accessToken) => {
  const res = await AxiosBase.post(
    `/customer/like/wall-message/`,
    { message_id },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const RateBusiness = async (business_id, rating, accessToken) => {
  const res = await AxiosBase.post(
    `/user/business/rate/`,
    { business_id, rating },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const GetBusinessCampaignsForProfile = async (business_id, accessToken) => {
  const res = await AxiosBase.get(`/campaign/customer/open/${business_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const GetBusinessPromotionsForProfile = async (business_id, accessToken) => {
  const res = await AxiosBase.get(`/promotion/customer/open/${business_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const GetFeedSearch = async (accessToken, search, latitude, longitude) => {
  const res = await AxiosBase.get(`/user/followed-businesses/?search=${search}&latitude=${latitude}&longitude=${longitude}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const SearchForBusinesses = async (accessToken, search, latitude, longitude) => {
  const res = await AxiosBase.get(`/user/search-businesses/?search=${search}&latitude=${latitude}&longitude=${longitude}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const GetBusinessesForMap = async (accessToken, latitude, longitude) => {
  const res = await AxiosBase.get(`/user/map-businesses/?&latitude=${latitude}&longitude=${longitude}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const GetFeed = async (accessToken, latitude, longitude) => {
  const res = await AxiosBase.get(`/user/followed-businesses/?latitude=${latitude}&longitude=${longitude}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
