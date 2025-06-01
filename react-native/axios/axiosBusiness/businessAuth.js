import AxiosBase from "../_base";

export const AuthenticateBusiness = async (email, password) => {
    const res = await AxiosBase.post("/auth/token/", {
        email,
        password,
        account: "business",
    });
    return res.data;
};

export const BusinessResgister = async (
    business_name,
    email,
    password,
    password_repeat,
    business_category,
    postal_code,
    street_number,
    street,
    city,
    country,
    latitude,
    longitude,
) => {
    const res = await AxiosBase.post("/business/user/add/", {
        business_name,
        email,
        password,
        password_repeat,
        business_category,
        postal_code,
        street_number,
        street,
        city,
        country,
        latitude,
        longitude,
    });
    return res.data;
};

export const AddBusinessUserProifile = async (
    token,
    business_name,
    business_category,
    postal_code,
    street_number,
    street,
    city,
    country,
    latitude,
    longitude,
) => {
    const res = await AxiosBase.post(
        "/customer/user/create-business-profile/",
        {
            business_name,
            business_category,
            postal_code,
            street_number,
            street,
            city,
            country,
            latitude,
            longitude,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return res.data;
};

export const VerifyBusiness = async (accessToken) => {
    const res = await AxiosBase.post("/auth/token/verify/", {
        token: accessToken,
    });
    return res.data;
};

export const RecoverPassword = async (email) => {
    const res = await AxiosBase.post("/user/recover-password/", {
        email,
    });
    return res.data;
};

export const DeleteBusinessAccount = async (token) => {
    const res = await AxiosBase.delete("/business/user/delete/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const ResendVerificationLink = async (token) => {
    const res = await AxiosBase.get("/business/user/resend-link/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};


export const RefreshBusiness = async (refreshToken) => {
    const res = await AxiosBase.post("/auth/token/refresh/", {
        refresh: refreshToken,
    });
    return res.data;
};

export const GetMeUser = async (token) => {
    const res = await AxiosBase.get("/business/user/me/", {
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
    const res = await AxiosBase.patch(`/business/user/update/`, data, {
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

export const GetBusinessCategoryList = async () => {
    const res = await AxiosBase.get("/business/categories/");
    return res.data;
};
