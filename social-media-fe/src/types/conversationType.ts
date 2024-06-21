import { Moment } from "moment";

export interface Member {
    user_id: number;
    name: string;
    email: string;
    image_url: string;
}

export interface GroupSettings {
    link_to_join_group?: string;
    confirm_new_member: boolean;
    join_by_link: boolean;
    allow_deputy_send_messages: boolean;
    restricted_messaging: boolean;
    allow_member_to_pin_message: boolean;
    allow_deputy_change_group_info: boolean;
    allow_member_to_invite_member: boolean;
    allow_member_to_change_group_info: boolean;
    allow_deputy_promote_member: boolean;
    allow_deputy_demote_member: boolean;
    allow_deputy_remove_member: boolean;
    allow_deputy_to_invite_member: boolean;
}

export type ConversationResponse = {
    conversation_id: string;
    name: string;
    image: string;
    members: {
        [key: string]: Member;
    };
    type: string;
    owner_id?: number;
    settings: GroupSettings;
    deputies: number[];
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
    notification_type?: string;
    target_user_id?: Member[];
    reactions?: {
        [key: string]: number[];
    };
    created_at: number;
    updated_at: number;
    reply_message?: {
        message_id: string;
        content: string;
        sender_id: number;
        type?: string;
    };
    read_by?: Member[];
}

export type MessageResponse = {
    [key: string]: MessageData;
};

export interface GroupedMessage {
    time: Moment;
    formattedTime: string;
    data: MessageData[];
}
