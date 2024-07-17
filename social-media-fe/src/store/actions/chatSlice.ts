import { Member } from "@/types/conversationType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ChatType = {
    chatInfo: Member;
};

const initialState: ChatType = {
    chatInfo: {} as Member,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChatInfo(state, action: PayloadAction<Member>) {
            state.chatInfo = action.payload;
        },
    },
});

export const { setChatInfo } = chatSlice.actions;
export default chatSlice.reducer;
