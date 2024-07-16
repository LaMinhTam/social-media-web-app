import { SOCIAL_MEDIA_API } from "@/apis/constants";
import { toast } from "react-toastify";
import { saveAccessToken, saveRefreshToken } from ".";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import saveUserInfoToCookie from "./saveUserInfoToCookie";
import { AxiosResponse } from "axios";

import apiRoutes from "@/apis";
import { Member } from "@/types/conversationType";
import { axiosInstance } from "@/apis/axios";

export default async function handleRefreshToken(
    accessToken: string,
    refreshToken: string,
    push: (href: string, options?: NavigateOptions | undefined) => void
) {
    try {
        if (accessToken && refreshToken) {
            const response = await SOCIAL_MEDIA_API.AUTH.refreshToken(
                refreshToken
            );
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
                }
            }
        }
    } catch (error) {
        saveAccessToken("");
        saveRefreshToken("");
        toast.error("Session expired, please login again");
        push("/signin");
    }
}
