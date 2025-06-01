import AxiosBase from "../_base";

export const AuthenticateCustomer = async (email, password) => {
    const res = await AxiosBase.post("/auth/token/", {
        email,
        password,
        account: "customer",
    });
    return res.data;
};

export const CreateCustomerAccount = async (email, password) => {
    const res = await AxiosBase.post("/customer/user/add/", {
        email, password
    });
    return res.data;
};

export const SendVerificationEmail = async (accessToken) => {
    const res = await AxiosBase.post("/customer/user/send-link/", {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    return res.data;
};

export const CheckIfUserVerified = async (email) => {
    const res = await AxiosBase.post("/customer/user/is-verified/", {
        email,
    });
    return res.data;
};

export const VerifyCustomer = async (accessToken) => {
    const res = await AxiosBase.post("/auth/token/verify/", {
        token: accessToken,
    });
    return res.data;
};

export const RefreshCustomer = async (refreshToken) => {
    const res = await AxiosBase.post("/auth/token/refresh/", {
        refresh: refreshToken,
    });
    return res.data;
};

export const GetMeUser = async (token) => {
    const res = await AxiosBase.get("/customer/user/me/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const getUserBySecretKey = async (secret_key, token) => {
    const res = await AxiosBase.get(`enduser/user/${secret_key}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const updateAccount = async (token, data) => {
    const res = await AxiosBase.patch(`/customer/user/update/`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const SendBusinessQr = async (accessToken) => {
    const res = await AxiosBase.post(
        "/business/send-qr/",
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );
    return res.data;
};
