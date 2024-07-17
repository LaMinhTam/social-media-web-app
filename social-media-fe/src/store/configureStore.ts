import { configureStore, combineReducers } from "@reduxjs/toolkit";
import searchSlice from "./actions/searchSlice";
import userSlice from "./actions/userSlice";
import commonSlice from "./actions/commonSlice";
import profileSlice from "./actions/profileSlice";
import chatSlice from "./actions/chatSlice";
import conversationSlice from "./actions/conversationSlice";
import postSlice from "./actions/postSlice";

const reducer = combineReducers({
    user: userSlice,
    search: searchSlice,
    common: commonSlice,
    profile: profileSlice,
    chat: chatSlice,
    conversation: conversationSlice,
    post: postSlice,
});

const store = configureStore({
    reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
