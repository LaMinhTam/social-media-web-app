import { Moment } from "moment";

export interface Member {
    user_id: number;
    name: string;
    email: string;
    image_url: string;
}

export type ConversationResponse = {
    conversation_id: string;
    name: string;
    image: string;
    members: Member[];
    type: string;
};

export type ReactionResponse = {
    message_id: string;
    conversation_id: string;
    user_detail: Member;
    content: string;
    type: string;
    reactions: {
        [key: string]: number[];
    };
    created_at: number;
    updated_at: number;
};

export interface MessageData {
    message_id: string;
    conversation_id: string;
    user_detail: Member;
    content: string;
    type: string;
    reactions?: {
        [key: string]: number[];
    };
    created_at: number;
    updated_at: number;
    read_by?: {
        [key: string]: Member;
    };
}

export type MessageResponse = {
    [key: string]: MessageData;
};

export interface GroupedMessage {
    time: Moment;
    formattedTime: string;
    data: MessageData[];
}
