import {
    LoginResponse,
    RefreshTokenResponse,
    SignUpResponse,
    UserResponse,
} from "@/types/authType";
import axios, { axiosPrivate } from "./axios";
import apiRoutes from ".";
import { AxiosResponse } from "axios";

const createUser = async (name: string, email: string, password: string) => {
    const response: AxiosResponse<SignUpResponse> = await axios.post(
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
    const response: AxiosResponse<LoginResponse> = await axios.post(
        apiRoutes.auth.login,
        {
            email,
            password,
        }
    );
    return response;
};

const getMe = async () => {
    const response: AxiosResponse<UserResponse> = await axiosPrivate.get(
        apiRoutes.auth.userDetails
    );
    return response;
};

const refreshOAuth2Token = async (refreshToken: string) => {
    const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
        apiRoutes.auth.refresh,
        {
            refreshToken: refreshToken,
        },
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        }
    );
    return response;
};

const refreshToken = async (accessToken: string, refreshToken: string) => {
    const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
        apiRoutes.auth.refresh,
        {
            accessToken,
            refreshToken,
        }
    );
    return response;
};

export const AUTH = {
    createUser,
    login,
    getMe,
    refreshToken,
    refreshOAuth2Token,
};