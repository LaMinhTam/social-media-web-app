import { ListFriendResponse, UserResponse } from "@/types/userType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type FriendType = {
    relationshipUsers: ListFriendResponse;
};

const initialState: FriendType = {
    relationshipUsers: {} as ListFriendResponse,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setRelationshipUsers: (
            state,
            action: PayloadAction<ListFriendResponse>
        ) => {
            state.relationshipUsers = action.payload;
        },
    },
});

export const { setRelationshipUsers } = userSlice.actions;
export default userSlice.reducer;
