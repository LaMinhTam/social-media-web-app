"use client";
import apiRoutes from "@/apis";
import { axiosInstance } from "@/apis/axios";
import { SOCIAL_MEDIA_API } from "@/apis/constants";
import { Member } from "@/types/conversationType";
import { saveAccessToken, saveRefreshToken } from "@/utils/auth";
import saveUserInfoToCookie from "@/utils/auth/saveUserInfoToCookie";
import { AxiosResponse } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { toast } from "react-toastify";

const OAuth2RedirectHandler = () => {
    const router = useRouter();
    const token = useSearchParams().get("token")?.split("#_=_")[0];
    const error = useSearchParams().get("error");

    useEffect(() => {
        async function handleOAuth2() {
            if (!error && token) {
                try {
                    const response =
                        await SOCIAL_MEDIA_API.AUTH.refreshOAuth2Token(token);
                    if (response.status === 200) {
                        const meResponse: AxiosResponse<Member> =
                            await axiosInstance.get(apiRoutes.user.getMe, {
                                headers: {
                                    Authorization: `Bearer ${response.data.accessToken}`,
                                },
                            });

                        if (meResponse.status === 200) {
                            saveAccessToken(response.data.accessToken);
                            saveRefreshToken(response.data.refreshToken);
                            saveUserInfoToCookie(
                                meResponse.data,
                                response.data.accessToken
                            );
                            router.push("/");
                        }
                    }
                } catch (error) {
                    router.push("/signin");
                    toast.error(
                        "There was an error processing your request, please try again."
                    );
                    console.error("Error: ", error);
                }
            } else {
                router.push("/signin");
                toast.error(
                    "There was an error processing your request, please try again."
                );
                console.error("Error: ", error);
            }
        }
        handleOAuth2();
    }, [token, error]);

    return <Suspense>OAuth2</Suspense>;
};

export default OAuth2RedirectHandler;
