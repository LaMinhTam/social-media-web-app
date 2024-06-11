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
