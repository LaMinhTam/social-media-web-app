import { Member } from "@/types/conversationType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProfileType = {
    currentUserProfile: Member;
};

const initialState: ProfileType = {
    currentUserProfile: {} as Member,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setCurrentUserProfile: (state, action: PayloadAction<Member>) => {
            state.currentUserProfile = action.payload;
        },
    },
});

export const { setCurrentUserProfile } = profileSlice.actions;

export default profileSlice.reducer;
