import AxiosBase from "../_base";

export const GoogleAuthSignIn = async (data, user, is_business) => {
    console.log(is_business);
    const res = await AxiosBase.post(`/google/auth/sign-in/`, {
        idToken: data.idToken,
        email: user.email,
        familyName: user.familyName,
        givenName: user.givenName,
        photo: user.photo,
        is_business,
    });
    return res.data;
};

export const GoogleSignUp = async (
    data,
    user,
    is_business,
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
    console.log(is_business);
    const res = await AxiosBase.post(`/google/auth/sign-up/`, {
        idToken: data.idToken,
        email: user.email,
        familyName: user.familyName,
        givenName: user.givenName,
        photo: user.photo,
        is_business,
        business_name,
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

export const AppleAuthSignIn = async (data, is_business) => {
    console.log('Creadentials', data.identityToken, data.email, data.user)
    const res = await AxiosBase.post(`/apple/auth/sign-in/`, {
        identity_token: data.identityToken,
        email: data.email,
        // familyName: data.fullName.familyName,
        // givenName: data.fullName.givenName,
        user_apple_id: data.user,
        is_business,
    });
    return res.data;
};

export const AppleSignUp = async (
    data,
    is_business,
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
    console.log(data);
    const res = await AxiosBase.post(`/apple/auth/sign-up/`, {
        identity_token: data.identityToken,
        email: data.email,
        // familyName: data.fullName.familyName,
        // givenName: data.fullName.givenName,
        user_apple_id: data.user,
        is_business,
        business_name,
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
