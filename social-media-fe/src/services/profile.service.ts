import { SOCIAL_MEDIA_API } from "../apis/constants";

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

export async function handleUpdateProfile(data: {
    name: string;
    image_url: string;
    cover: string;
}) {
    try {
        const response = await SOCIAL_MEDIA_API.USER.updateProfile(data);
        console.log("response:", response);
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
}
