import { AxiosResponse } from "axios";
import { axiosPrivate } from "./axios";
import apiRoutes from ".";
import { OnlineResponse } from "@/types/commonType";
import { ConversationDetailResponse } from "@/types/conversationType";

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
    const response: AxiosResponse<string> = await axiosPrivate.get(
        apiRoutes.conversation.list
    );
    return response;
};

const getConversationDetail = async (id: string) => {
    const response: AxiosResponse<ConversationDetailResponse> =
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

export const CONVERSATION = {
    createConversation,
    getListConversation,
    getConversationDetail,
    disbandGroup,
    getUserStatus,
};
