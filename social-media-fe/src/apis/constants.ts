import { LoginResponse, SignUpResponse } from "@/types/commonType";
import apiRoutes from ".";
import axios from "./axios";

const createUser = async (name: string, email: string, password: string) => {
    const response = await axios.post<SignUpResponse>(apiRoutes.signup, {
        name,
        email,
        password,
    });
    return response.data;
};

const login = async (email: string, password: string) => {
    const response = await axios.post<LoginResponse>(apiRoutes.login, {
        email,
        password,
    });
    return response.data;
};

export const SOCIAL_MEDIA_API = {
    createUser,
    login,
};
