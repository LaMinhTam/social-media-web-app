import { ListFriendResponse } from "@/types/userType";
import { AxiosResponse } from "axios";
import apiRoutes from ".";
import { axiosPrivate } from "./axios";
import { Member } from "@/types/conversationType";
import PostResponse from "@/types/postType";

const getMe = async () => {
    const response: AxiosResponse<Member> = await axiosPrivate.get(
        apiRoutes.user.getMe
    );
    return response;
};

const findUserById = async (id: string) => {
    try {
        const response: AxiosResponse<Member> = await axiosPrivate.get(
            apiRoutes.user.findUserById(id)
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

const findUserByName = async (name: string) => {
    try {
        const response: AxiosResponse<Member[]> = await axiosPrivate.get(
            apiRoutes.user.findUserByName(name)
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

const getCurrentUserFriends = async () => {
    try {
        const response: AxiosResponse<ListFriendResponse> =
            await axiosPrivate.get(apiRoutes.user.getFriends);
        return response;
    } catch (error) {
        console.error(error);
    }
};

const sendFriendRequest = async (userId: number) => {
    try {
        const response: AxiosResponse<string> = await axiosPrivate.post(
            apiRoutes.user.sendFriendRequest,
            {
                target_id: userId,
            }
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

const acceptFriendRequest = async (
    targetId: number,
    friendRequestId: number
) => {
    try {
        const response: AxiosResponse<string> = await axiosPrivate.post(
            apiRoutes.user.acceptFriendRequest,
            {
                target_id: targetId,
                friend_request_id: friendRequestId,
            }
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

const removeFriend = async (targetId: number, friendRequestId: number) => {
    try {
        const response: AxiosResponse<string> = await axiosPrivate.delete(
            apiRoutes.user.removeFriend,
            {
                data: {
                    target_id: targetId,
                    friend_request_id: friendRequestId,
                },
            }
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

const revokeFriendRequest = async (
    targetId: number,
    friendRequestId: number
) => {
    try {
        const response: AxiosResponse<string> = await axiosPrivate.delete(
            apiRoutes.user.recallFriendRequest,
            {
                data: {
                    target_id: targetId,
                    friend_request_id: friendRequestId,
                },
            }
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

const updateProfile = async (data: {
    name: string;
    image_url: string;
    cover: string;
}) => {
    try {
        const response: AxiosResponse<Member> = await axiosPrivate.put(
            apiRoutes.user.updateProfile,
            data
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

const getUserWall = async (userId: number, page: number, size: number) => {
    const response: AxiosResponse<PostResponse> = await axiosPrivate.get(
        apiRoutes.user.userWall(userId, size, page)
    );
    return response;
};

const followUser = async (userId: number) => {
    const response: AxiosResponse<string> = await axiosPrivate.post(
        apiRoutes.user.followUser(userId)
    );
    return response;
};

export const USER = {
    getMe,
    findUserById,
    findUserByName,
    getCurrentUserFriends,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    revokeFriendRequest,
    updateProfile,
    getUserWall,
    followUser,
};
