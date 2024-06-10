import { UserResponse } from "@/types/userType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProfileType = {
    currentUserProfile: UserResponse;
};

const initialState: ProfileType = {
    currentUserProfile: {} as UserResponse,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setCurrentUserProfile: (state, action: PayloadAction<UserResponse>) => {
            state.currentUserProfile = action.payload;
        },
    },
});

export const { setCurrentUserProfile } = profileSlice.actions;

export default profileSlice.reducer;
