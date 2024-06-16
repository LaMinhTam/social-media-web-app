import { AxiosResponse } from "axios";
import { axiosPrivate } from "./axios";
import apiRoutes from ".";
import { OnlineResponse } from "@/types/commonType";
import {
    ConversationResponse,
    MessageResponse,
    ReactionResponse,
} from "@/types/conversationType";

const createConversation = async (
    type: string,
    members: number[],
    name = "default",
    image = "https://source.unsplash.com/random"
) => {
    const response: AxiosResponse<string> = await axiosPrivate.post(
        apiRoutes.conversation.create,
        {
            name,
            image,
            members,
            type,
        }
    );
    return response;
};

const getListConversation = async () => {
    const response: AxiosResponse<ConversationResponse[]> =
        await axiosPrivate.get(apiRoutes.conversation.list);
    return response;
};

const getConversationDetail = async (id: string) => {
    const response: AxiosResponse<ConversationResponse> =
        await axiosPrivate.get(apiRoutes.conversation.detail(id));
    return response;
};

const disbandGroup = async (id: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.disband(id)
    );
    return response;
};

const getUserStatus = async (id: string) => {
    const response: AxiosResponse<OnlineResponse> = await axiosPrivate.get(
        apiRoutes.conversation.getUserStatus(id)
    );
    return response;
};

const getListMessage = async (id: string, size: number) => {
    const response: AxiosResponse<MessageResponse> = await axiosPrivate.get(
        apiRoutes.conversation.getListMessageByPage(id, size)
    );
    return response;
};

const shareMessage = async (messageId: string, conversationIds: string[]) => {
    const response: AxiosResponse<string> = await axiosPrivate.post(
        apiRoutes.conversation.shareMessage,
        {
            message_id: messageId,
            conversation_ids: conversationIds,
        }
    );
    return response;
};

const revokeMessage = async (messageId: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.revokeMessage(messageId)
    );
    return response;
};

const deleteMessage = async (messageId: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.deleteMessage(messageId)
    );
    return response;
};

const reactionMessage = async (messageId: string, reaction: string) => {
    const response: AxiosResponse<ReactionResponse> = await axiosPrivate.post(
        apiRoutes.conversation.reactMessage,
        {
            message_id: messageId,
            reaction,
        }
    );
    return response;
};

export const CONVERSATION = {
    createConversation,
    getListConversation,
    getConversationDetail,
    disbandGroup,
    getUserStatus,
    getListMessage,
    shareMessage,
    revokeMessage,
    deleteMessage,
    reactionMessage,
};
