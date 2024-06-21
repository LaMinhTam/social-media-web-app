import { UserResponse } from "@/types/userType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ChatType = {
    chatInfo: UserResponse;
};

const initialState: ChatType = {
    chatInfo: {} as UserResponse,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChatInfo(state, action: PayloadAction<UserResponse>) {
            state.chatInfo = action.payload;
        },
    },
});

export const { setChatInfo } = chatSlice.actions;
export default chatSlice.reducer;
