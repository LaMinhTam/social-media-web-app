import { SOCIAL_MEDIA_API } from "@/apis/constants";
import { toast } from "react-toastify";
import { saveAccessToken, saveRefreshToken } from ".";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default async function handleRefreshToken(
    accessToken: string,
    refreshToken: string,
    push: (href: string, options?: NavigateOptions | undefined) => void
) {
    try {
        if (accessToken && refreshToken) {
            const response = await SOCIAL_MEDIA_API.AUTH.refreshToken(
                accessToken,
                refreshToken
            );
            if (response.status === 200) {
                saveAccessToken(response.data.accessToken);
                saveRefreshToken(response.data.refreshToken);
            }
        } else {
            if (refreshToken) {
                const response = await SOCIAL_MEDIA_API.AUTH.refreshOAuth2Token(
                    refreshToken
                );
                if (response.status === 200) {
                    saveAccessToken(response.data.accessToken);
                    saveRefreshToken(response.data.refreshToken);
                }
            }
        }
    } catch (error) {
        saveAccessToken("");
        saveRefreshToken("");
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        push("/signin");
    }
}
