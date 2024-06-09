import { UserResponse } from "@/types/userType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type CommonType = {
    triggerReFetchingRelationship: boolean;
};

const initialState: CommonType = {
    triggerReFetchingRelationship: true,
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
    },
});

export const { setTriggerReFetchingRelationship } = commonSlice.actions;
export default commonSlice.reducer;
