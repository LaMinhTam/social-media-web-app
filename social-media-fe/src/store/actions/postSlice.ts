import { Member } from "@/types/conversationType";
import PostResponse, { PostData } from "@/types/postType";
import { FriendRequestData } from "@/types/userType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type PostSlice = {
    openCreatePostDialog: boolean;
    taggedList: FriendRequestData[];
    posts: PostResponse;
    triggerFetchingPost: boolean;
    openPostDialog: boolean;
    currentPostData: PostData | null;
};

const initialState: PostSlice = {
    openCreatePostDialog: false,
    taggedList: [],
    posts: {},
    triggerFetchingPost: false,
    openPostDialog: false,
    currentPostData: null,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setOpenCreatePostDialog: (state, action: PayloadAction<boolean>) => {
            state.openCreatePostDialog = action.payload;
        },
        setTaggedList: (state, action: PayloadAction<FriendRequestData[]>) => {
            state.taggedList = action.payload;
        },
        setPosts: (state, action: PayloadAction<PostResponse>) => {
            state.posts = action.payload;
        },
        setTriggerFetchingPost: (state, action: PayloadAction<boolean>) => {
            state.triggerFetchingPost = action.payload;
        },
        setOpenPostDialog: (state, action: PayloadAction<boolean>) => {
            state.openPostDialog = action.payload;
        },
        setCurrentPostData: (state, action: PayloadAction<PostData>) => {
            state.currentPostData = action.payload;
        },
    },
});

export const {
    setOpenCreatePostDialog,
    setTaggedList,
    setPosts,
    setTriggerFetchingPost,
    setOpenPostDialog,
    setCurrentPostData,
} = postSlice.actions;
export default postSlice.reducer;
