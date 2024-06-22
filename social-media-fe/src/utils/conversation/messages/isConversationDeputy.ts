import { ConversationResponse } from "@/types/conversationType";

export default function isConversationDeputy(
    id: number,
    currentConversation: ConversationResponse
) {
    const condition = currentConversation.deputies.some(
        (deputy) => deputy === id
    );
    return condition;
}
