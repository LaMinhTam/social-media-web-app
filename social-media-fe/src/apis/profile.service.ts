import { SOCIAL_MEDIA_API } from "./constants";

export async function fetchingMe() {
    try {
        const response = await SOCIAL_MEDIA_API.USER.getMe();
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
}
