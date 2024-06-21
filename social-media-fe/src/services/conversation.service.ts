import axios from "@/apis/axios";
import { SOCIAL_MEDIA_API } from "@/apis/constants";
export const handleCreateConversation = async (
    type: string,
    members: number[],
    name = "default",
    image = "https://source.unsplash.com/random"
) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.createConversation(
            type,
            members,
            name,
            image
        );
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleGetConversationDetails = async (id: string) => {
    try {
        const response =
            await SOCIAL_MEDIA_API.CONVERSATION.getConversationDetail(id);
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleGetListConversation = async () => {
    try {
        const response =
            await SOCIAL_MEDIA_API.CONVERSATION.getListConversation();
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleGetListMessage = async (id: string, size: number) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.getListMessage(
            id,
            size
        );
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleGetUserStatus = async (id: string) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.getUserStatus(id);
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleRevokeMessage = async (messageId: string) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.revokeMessage(
            messageId
        );
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleDeleteMessage = async (messageId: string) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.deleteMessage(
            messageId
        );
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleShareMessage = async (
    messageId: string,
    conversationIds: string[]
) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.shareMessage(
            messageId,
            conversationIds
        );
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleReactionMessage = async (
    messageId: string,
    reaction: string
) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.reactionMessage(
            messageId,
            reaction
        );
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleReadMessage = async (messageId: string) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.readMessage(
            messageId
        );
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleChangeGroupName = async (id: string, name: string) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.changeName(
            id,
            name
        );
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleChangeGroupAvatar = async (id: string, imageUrl: string) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.changeImage(
            id,
            imageUrl
        );
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleAddMember = async (id: string, userId: number) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.addMember(
            id,
            userId
        );
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleKickMember = async (id: string, userId: number) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.kickMember(
            id,
            userId
        );
        console.log("handleKickMember ~ response:", response);
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleDisbandGroup = async (id: string) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.disbandGroup(id);
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleLeaveGroup = async (id: string) => {
    try {
        const response = await SOCIAL_MEDIA_API.CONVERSATION.leaveGroup(id);
        console.log("handleLeaveGroup ~ response:", response);
        if (response?.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
};

export const handleUploadFile = async (formData: FormData) => {
    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            formData
        );
        const imageUrl = response.data.secure_url;
        if (imageUrl) {
            return imageUrl;
        }
    } catch (error) {
        console.error("Error uploading file:", error);
    }
};
