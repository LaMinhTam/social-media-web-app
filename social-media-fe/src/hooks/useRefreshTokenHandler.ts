import { getAccessToken, getRefreshToken } from "@/utils/auth";
import handleRefreshToken from "@/utils/auth/handleRefreshToken";
import { useRouter } from "next/navigation";

export default function useRefreshToken() {
    let isRefreshingToken = false;
    const { push } = useRouter();
    const refreshTokenHandler = async () => {
        if (isRefreshingToken) {
            return new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (!isRefreshingToken) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
        isRefreshingToken = true;
        const refreshToken = getRefreshToken() ?? "";
        const accessToken = getAccessToken() ?? "";
        try {
            await handleRefreshToken(accessToken, refreshToken, push);
        } finally {
            isRefreshingToken = false;
        }
    };
    return refreshTokenHandler;
}
