import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type CommonType = {
    triggerReFetchingRelationship: boolean;
    showChatModal: boolean;
    openCallDialog: boolean;
    openIncomingCallDialog: boolean;
};

const initialState: CommonType = {
    triggerReFetchingRelationship: true,
    showChatModal: false,
    openCallDialog: false,
    openIncomingCallDialog: false,
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
        setOpenIncomingCallDialog(state, action: PayloadAction<boolean>) {
            state.openIncomingCallDialog = action.payload;
        },
    },
});

export const {
    setTriggerReFetchingRelationship,
    setShowChatModal,
    setOpenCallDialog,
    setOpenIncomingCallDialog,
} = commonSlice.actions;
export default commonSlice.reducer;
