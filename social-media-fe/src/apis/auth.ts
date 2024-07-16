import {
    LoginResponse,
    RefreshTokenResponse,
    SignUpResponse,
} from "@/types/authType";
import { axiosInstance, axiosPrivate } from "./axios";
import apiRoutes from ".";
import { AxiosResponse } from "axios";

const createUser = async (name: string, email: string, password: string) => {
    const response: AxiosResponse<SignUpResponse> = await axiosInstance.post(
        apiRoutes.auth.signup,
        {
            name,
            email,
            password,
        }
    );
    return response;
};

const login = async (email: string, password: string) => {
    const response: AxiosResponse<LoginResponse> = await axiosInstance.post(
        apiRoutes.auth.login,
        {
            email,
            password,
        }
    );
    return response;
};

const refreshOAuth2Token = async (refreshToken: string) => {
    const response: AxiosResponse<RefreshTokenResponse> =
        await axiosInstance.post(
            apiRoutes.auth.refresh,
            {},
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        );
    return response;
};

const refreshToken = async (refreshToken: string) => {
    const response: AxiosResponse<RefreshTokenResponse> =
        await axiosInstance.post(
            apiRoutes.auth.refresh,
            {},
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        );
    return response;
};
const logout = async (refreshToken: string) => {
    const response = await axiosInstance.post(
        apiRoutes.auth.logout,
        {},
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        }
    );
    return response;
};

const resetPassword = async (oldPassword: string, newPassword: string) => {
    const response = await axiosPrivate.post(apiRoutes.auth.resetPassword, {
        oldPassword,
        newPassword,
    });
    return response;
};

export const AUTH = {
    createUser,
    login,
    refreshToken,
    refreshOAuth2Token,
    logout,
    resetPassword,
};
