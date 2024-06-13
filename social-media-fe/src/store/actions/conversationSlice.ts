import { ConversationResponse } from "@/types/conversationType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ConversationType = {
    currentConversation: ConversationResponse;
    currentPage: number;
};

const initialState: ConversationType = {
    currentConversation: {} as ConversationResponse,
    currentPage: 1,
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
    },
});

export const { setCurrentConversation, setCurrentPage } =
    conversationSlice.actions;
export default conversationSlice.reducer;
