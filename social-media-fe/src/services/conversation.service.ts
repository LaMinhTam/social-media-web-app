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
