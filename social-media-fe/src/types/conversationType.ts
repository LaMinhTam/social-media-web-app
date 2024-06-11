export interface Member {
    user_id: number;
    name: string;
    email: string;
    image_url: string;
}

export type ConversationDetailResponse = {
    conversation_id: string;
    name: string;
    image: string;
    members: Member[];
    type: string;
};
