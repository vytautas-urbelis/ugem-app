import AxiosBase from "../_base";

export const InviteTeamMember = async (token, receiver) => {
  const res = await AxiosBase.post(
    "/teams-request/",
    { receiver },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const GetTeamsRequests = async (token) => {
  const res = await AxiosBase.get("/teams-request/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const UpdateRequestStatus = async (token, status, request_id) => {
  const res = await AxiosBase.patch(
    `/teams-request/update/${request_id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
