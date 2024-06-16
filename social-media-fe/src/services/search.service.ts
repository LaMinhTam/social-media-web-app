import axios from "@/apis/axios";
import { SOCIAL_MEDIA_API } from "../apis/constants";
import {
    GIF_URL_SEARCH_ENDPOINT,
    GIF_URL_TRENDING_ENDPOINT,
} from "@/constants/global";

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

export async function getTrendingGIFs(limit: number) {
    try {
        const response = await axios.get(
            `${GIF_URL_TRENDING_ENDPOINT}?api_key=${process.env.NEXT_PUBLIC_GIPHY_API_KEY}&limit=${limit}`
        );
        if (response?.status === 200) return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function searchGIFs(searchTerm: string, limit: number) {
    try {
        const response = await axios.get(
            `${GIF_URL_SEARCH_ENDPOINT}?api_key=${process.env.NEXT_PUBLIC_GIPHY_API_KEY}&q=${searchTerm}&limit=${limit}`
        );
        if (response?.status === 200) return response.data;
    } catch (error) {
        console.error(error);
    }
}
