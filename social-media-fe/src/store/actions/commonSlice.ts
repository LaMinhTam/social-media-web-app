import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type CommonType = {
    triggerReFetchingRelationship: boolean;
    showChatModal: boolean;
    openCallDialog: boolean;
};

const initialState: CommonType = {
    triggerReFetchingRelationship: true,
    showChatModal: false,
    openCallDialog: false,
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
        setOpenCallDialog(state, action: PayloadAction<boolean>) {
            state.openCallDialog = action.payload;
        },
    },
});

export const {
    setTriggerReFetchingRelationship,
    setShowChatModal,
    setOpenCallDialog,
} = commonSlice.actions;
export default commonSlice.reducer;
