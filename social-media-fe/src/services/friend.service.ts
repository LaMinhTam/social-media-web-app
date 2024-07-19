import { toast } from "react-toastify";
import { SOCIAL_MEDIA_API } from "../apis/constants";

export async function handleSendFriendRequest(userId: number) {
    try {
        const response = await SOCIAL_MEDIA_API.USER.sendFriendRequest(userId);
        if (response?.status === 200) {
            toast.success("Friend request sent!");
        }
    } catch (error) {
        console.error(error);
        toast.error("There was an error, please try again later!");
    }
}

export async function handleAcceptFriendRequest(
    targetId: number,
    friendRequestId: number
) {
    try {
        const response = await SOCIAL_MEDIA_API.USER.acceptFriendRequest(
            targetId,
            friendRequestId
        );
        if (response?.status === 200) {
            const conversationId =
                await SOCIAL_MEDIA_API.CONVERSATION.createConversation(
                    "PRIVATE",
                    [targetId]
                );
            if (conversationId) {
                toast.success("You are now friends!");
            }
        }
    } catch (error) {
        console.error(error);
        toast.error("There was an error, please try again later!");
    }
}

export async function handleRevokeFriendRequest(
    targetId: number,
    friendRequestId: number
) {
    try {
        const response = await SOCIAL_MEDIA_API.USER.revokeFriendRequest(
            targetId,
            friendRequestId
        );
        if (response?.status === 200) {
            toast.success("Revoked friend request!");
        }
    } catch (error) {
        console.error(error);
        toast.error("There was an error, please try again later!");
    }
}

export async function handleFollowUser(id: number) {
    try {
        const response = await SOCIAL_MEDIA_API.USER.followUser(id);
        if (response?.status === 200) {
            toast.success("Followed user!");
        }
    } catch (error) {
        console.error(error);
        toast.error("There was an error, please try again later!");
    }
}

export async function handleRemoveFriend(
    targetId: number,
    friendRequestId: number
) {
    try {
        const response = await SOCIAL_MEDIA_API.USER.removeFriend(
            targetId,
            friendRequestId
        );
        if (response?.status === 200) {
            toast.success("Removed friend!");
        }
    } catch (error) {
        console.error(error);
        toast.error("There was an error, please try again later!");
    }
}
