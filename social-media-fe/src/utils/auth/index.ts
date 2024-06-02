import Cookies from "js-cookie";

import { jwtDecode } from "jwt-decode";

const accessTokenKey = "SOCIAL_MEDIA_ACCESS_TOKEN";
const refreshTokenKey = "SOCIAL_MEDIA_REFRESH_TOKEN";
const userKey = "SOCIAL_MEDIA_USER";

const objCookies = {
    expires: 30,
    domain: window.location.hostname,
};

export const saveAccessToken = (access_token: string) => {
    if (access_token) {
        Cookies.set(accessTokenKey, access_token, {
            ...objCookies,
        });
    } else {
        Cookies.remove(accessTokenKey, {
            ...objCookies,
            path: "/",
            domain: window.location.hostname,
        });
    }
};

export const saveRefreshToken = (refresh_token: string) => {
    if (refresh_token) {
        Cookies.set(refreshTokenKey, refresh_token, {
            ...objCookies,
        });
    } else {
        Cookies.remove(refreshTokenKey, {
            ...objCookies,
            path: "/",
            domain: window.location.hostname,
        });
    }
};

export const getAccessToken = () => {
    const access_token = Cookies.get(accessTokenKey);
    return access_token;
};

export const getRefreshToken = () => {
    const refresh_token = Cookies.get(refreshTokenKey);
    return refresh_token;
};

export const isTokenExpire = (token: string) => {
    if (!token) return true;
    const decodedToken = jwtDecode(token);

    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp && decodedToken.exp < currentTime) {
        return true;
    } else {
        return false;
    }
};
