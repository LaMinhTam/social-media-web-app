import axios from "axios";
import { getAccessToken } from "../utils/auth";
import { API_BASE_URL } from "@/constants/global";

export default axios.create({
    baseURL: API_BASE_URL,
});
export const axiosPrivate = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosPrivate.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
