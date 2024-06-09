import { SOCIAL_MEDIA_API } from "./constants";

export async function findUserById(id: string) {
    try {
        const response = await SOCIAL_MEDIA_API.USER.findUserById(id);
        if (response?.status === 200) return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function findUserByName(name: string) {
    try {
        const response = await SOCIAL_MEDIA_API.USER.findUserByName(name);
        if (response?.status === 200) return response.data;
    } catch (error) {
        console.error(error);
    }
}
