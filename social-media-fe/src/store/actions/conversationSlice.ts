import { ConversationDetailResponse } from "@/types/conversationType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ConversationType = {
    currentConversationDetails: ConversationDetailResponse;
};

const initialState: ConversationType = {
    currentConversationDetails: {} as ConversationDetailResponse,
};

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setCurrentConversationDetails(
            state,
            action: PayloadAction<ConversationDetailResponse>
        ) {
            state.currentConversationDetails = action.payload;
        },
    },
});

export const { setCurrentConversationDetails } = conversationSlice.actions;
export default conversationSlice.reducer;
