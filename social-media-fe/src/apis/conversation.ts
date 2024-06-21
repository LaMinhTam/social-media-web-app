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

const addMember = async (id: string, userId: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.addMember(id, userId)
    );
    return response;
};

const kickMember = async (id: string, userId: number) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.kickMember(id, userId)
    );
    return response;
};

const leaveGroup = async (id: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.leaveGroup(id)
    );
    return response;
};

const disbandGroup = async (id: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.disband(id)
    );
    return response;
};

const changeName = async (id: string, name: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.changeName(id, name)
    );
    return response;
};

const changeImage = async (id: string, imageUrl: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.changeImage(id, imageUrl)
    );
    return response;
};

const changeGroupOwner = async (id: string, userId: number) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.changeGroupOwner(id, userId)
    );
    return response;
};

const grantDeputy = async (id: string, userId: number) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.grantDeputy(id, userId)
    );
    return response;
};

const revokeDeputy = async (id: string, userId: number) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.revokeDeputy(id, userId)
    );
    return response;
};

const updateGroupSetting = async (id: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.updateGroupSetting(id)
    );
    return response;
};

const findConversationByLink = async (link: string) => {
    const response: AxiosResponse<ConversationResponse> =
        await axiosPrivate.get(
            apiRoutes.conversation.findConversationByLink(link)
        );
    return response;
};

const joinConversationByLink = async (link: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.joinConversationByLink(link)
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

const readMessage = async (messageId: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.patch(
        apiRoutes.conversation.readMessage(messageId)
    );
    return response;
};

export const CONVERSATION = {
    createConversation,
    getListConversation,
    getConversationDetail,
    addMember,
    kickMember,
    leaveGroup,
    disbandGroup,
    changeName,
    changeImage,
    changeGroupOwner,
    grantDeputy,
    revokeDeputy,
    updateGroupSetting,
    findConversationByLink,
    joinConversationByLink,
    getUserStatus,
    getListMessage,
    shareMessage,
    revokeMessage,
    deleteMessage,
    reactionMessage,
    readMessage,
};
