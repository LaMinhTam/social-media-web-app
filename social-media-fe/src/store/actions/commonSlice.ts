import { UserResponse } from "@/types/userType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type CommonType = {
    triggerReFetchingRelationship: boolean;
    showChatModal: boolean;
};

const initialState: CommonType = {
    triggerReFetchingRelationship: true,
    showChatModal: false,
};

const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setTriggerReFetchingRelationship(
            state,
            action: PayloadAction<boolean>
        ) {
            state.triggerReFetchingRelationship = action.payload;
        },
        setShowChatModal(state, action: PayloadAction<boolean>) {
            state.showChatModal = action.payload;
        },
    },
});

export const { setTriggerReFetchingRelationship, setShowChatModal } =
    commonSlice.actions;
export default commonSlice.reducer;
