import { ConversationResponse, MessageData } from "@/types/conversationType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ConversationType = {
    currentConversation: ConversationResponse;
    currentSize: number;
    isReplying: boolean;
    messageReply: MessageData;
    reactionSelected: {
        name: string;
        emoji: string;
    };
};

const initialState: ConversationType = {
    currentConversation: {} as ConversationResponse,
    currentSize: 10,
    isReplying: false,
    messageReply: {} as MessageData,
    reactionSelected: {
        name: "",
        emoji: "",
    },
};

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setCurrentConversation(
            state,
            action: PayloadAction<ConversationResponse>
        ) {
            state.currentConversation = action.payload;
        },
        setCurrentSize(state, action: PayloadAction<number>) {
            state.currentSize = action.payload;
        },
        setIsReplying(state, action: PayloadAction<boolean>) {
            state.isReplying = action.payload;
        },
        setMessageReply(state, action: PayloadAction<MessageData>) {
            state.messageReply = action.payload;
        },
        setReactionSelected(
            state,
            action: PayloadAction<{ name: string; emoji: string }>
        ) {
            state.reactionSelected = action.payload;
        },
    },
});

export const {
    setCurrentConversation,
    setCurrentSize,
    setIsReplying,
    setMessageReply,
    setReactionSelected,
} = conversationSlice.actions;
export default conversationSlice.reducer;
