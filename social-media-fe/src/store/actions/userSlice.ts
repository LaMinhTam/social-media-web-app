import { Member } from "@/types/conversationType";
import { ListFriendResponse } from "@/types/userType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type FriendType = {
    relationshipUsers: ListFriendResponse;
    userClicked: Member;
};

const initialState: FriendType = {
    relationshipUsers: {} as ListFriendResponse,
    userClicked: {} as Member,
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
        setUserClicked: (state, action: PayloadAction<Member>) => {
            state.userClicked = action.payload;
        },
    },
});

export const { setRelationshipUsers, setUserClicked } = userSlice.actions;
export default userSlice.reducer;
