import { Member } from "@/types/conversationType";
import PostResponse, { CommentData, PostData } from "@/types/postType";
import { FriendRequestData } from "@/types/userType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type PostSlice = {
    openCreatePostDialog: boolean;
    taggedList: FriendRequestData[];
    posts: PostResponse;
    triggerFetchingPost: boolean;
    openPostDialog: boolean;
    currentPostData: PostData | null;
    replyComment: CommentData;
    content: string;
    openSharePostDialog: boolean;
    postShareId: string;
    page: number;
};

const initialState: PostSlice = {
    openCreatePostDialog: false,
    taggedList: [],
    posts: {},
    triggerFetchingPost: false,
    openPostDialog: false,
    currentPostData: null,
    replyComment: {} as CommentData,
    content: "",
    openSharePostDialog: false,
    postShareId: "",
    page: 1,
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
        setReplyComment: (state, action: PayloadAction<CommentData>) => {
            state.replyComment = action.payload;
        },
        setContent: (state, action: PayloadAction<string>) => {
            state.content = action.payload;
        },
        setOpenSharePostDialog: (state, action: PayloadAction<boolean>) => {
            state.openSharePostDialog = action.payload;
        },
        setPostShareId: (state, action: PayloadAction<string>) => {
            state.postShareId = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
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
    setReplyComment,
    setContent,
    setOpenSharePostDialog,
    setPostShareId,
    setPage,
} = postSlice.actions;
export default postSlice.reducer;
