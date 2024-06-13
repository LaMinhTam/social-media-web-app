"use client";
import useRefreshToken from "@/hooks/useRefreshTokenHandler";
import {
    getAccessToken,
    getRefreshToken,
    isTokenExpire,
    saveAccessToken,
    saveRefreshToken,
} from "@/utils/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const RequiredAuthLayout = ({ children }: { children: React.ReactNode }) => {
    const { push } = useRouter();
    const accessToken = getAccessToken() ?? "";
    const refreshToken = getRefreshToken() ?? "";
    const isAccessTokenExpired = isTokenExpire(accessToken);
    const refreshTokenHandler = useRefreshToken();
    useEffect(() => {
        const isRefreshTokenExpired = isTokenExpire(refreshToken);
        async function handleExpiredToken() {
            if (
                isAccessTokenExpired &&
                !isRefreshTokenExpired &&
                !accessToken
            ) {
                console.log("Access token expired");
                refreshTokenHandler();
            } else if (!isAccessTokenExpired) {
                console.log("Access token not expired");
                return;
            } else {
                saveAccessToken("");
                saveRefreshToken("");
                push("/signin");
            }
        }
        handleExpiredToken();
    }, [isAccessTokenExpired, push, refreshToken, refreshTokenHandler]);
    return <>{children}</>;
};

export default RequiredAuthLayout;
