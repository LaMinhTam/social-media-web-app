import { ListFriendResponse, UserResponse } from "@/types/userType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type FriendType = {
    relationshipUsers: ListFriendResponse;
    userClicked: UserResponse;
};

const initialState: FriendType = {
    relationshipUsers: {} as ListFriendResponse,
    userClicked: {} as UserResponse,
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
        setUserClicked: (state, action: PayloadAction<UserResponse>) => {
            state.userClicked = action.payload;
        },
    },
});

export const { setRelationshipUsers, setUserClicked } = userSlice.actions;
export default userSlice.reducer;
