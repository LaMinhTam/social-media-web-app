import { Client } from "stompjs";
import { MessageResponse } from "./conversationType";

type SocketType = {
    messages: MessageResponse;
    setMessages: (messages: MessageResponse) => void;
    stompClient: Client | null;
    setStompClient: (stompClient: Client) => void;
    optimisticMessages: MessageResponse;
    addOptimisticUpdate: (
        action:
            | MessageResponse
            | ((pendingState: MessageResponse) => MessageResponse)
    ) => void;
    triggerScrollChat: boolean;
    setTriggerScrollChat: (isNewMessage: boolean) => void;
};

export default SocketType;
