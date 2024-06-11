import { toast } from "react-toastify";
import { SOCIAL_MEDIA_API } from "../apis/constants";

export async function handleSendFriendRequest(userId: number) {
    try {
        const response = await SOCIAL_MEDIA_API.USER.sendFriendRequest(userId);
        if (response?.status === 200) {
            toast.success("Đã gửi lời mời kết bạn!");
        }
    } catch (error) {
        console.error(error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
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
                toast.success("Hai bạn đã trở thành bạn bè!");
            }
        }
    } catch (error) {
        console.error(error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
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
            toast.success("Đã hủy lời mời kết bạn!");
        }
    } catch (error) {
        console.error(error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
}
