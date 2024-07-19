import axios from "axios";
import { getAccessToken } from "../utils/auth";
import { API_BASE_URL } from "@/constants/global";
import axiosRetry from "axios-retry";

const RETRIES = 5;

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Apply axios-retry to the standard axios instance
axiosRetry(axiosInstance, {
    retries: RETRIES, // Number of retry attempts
    retryDelay: axiosRetry.exponentialDelay, // Exponential back-off delay between retries
    retryCondition: (error) => {
        // Retry for specific error codes or conditions
        return error.response ? error.response.status >= 500 : false;
    },
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

axiosRetry(axiosPrivate, {
    retries: RETRIES,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return error.response ? error.response.status >= 500 : false;
    },
});
