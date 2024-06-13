import { ConversationResponse, MessageData } from "@/types/conversationType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ConversationType = {
    currentConversation: ConversationResponse;
    currentPage: number;
    isReplying: boolean;
    messageReply: MessageData;
};

const initialState: ConversationType = {
    currentConversation: {} as ConversationResponse,
    currentPage: 1,
    isReplying: false,
    messageReply: {} as MessageData,
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
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        setIsReplying(state, action: PayloadAction<boolean>) {
            state.isReplying = action.payload;
        },
        setMessageReply(state, action: PayloadAction<MessageData>) {
            state.messageReply = action.payload;
        },
    },
});

export const {
    setCurrentConversation,
    setCurrentPage,
    setIsReplying,
    setMessageReply,
} = conversationSlice.actions;
export default conversationSlice.reducer;
