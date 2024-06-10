import { configureStore, combineReducers } from "@reduxjs/toolkit";
import searchSlice from "./actions/searchSlice";
import userSlice from "./actions/userSlice";
import commonSlice from "./actions/commonSlice";
import profileSlice from "./actions/profileSlice";
import chatSlice from "./actions/chatSlice";

const reducer = combineReducers({
    user: userSlice,
    search: searchSlice,
    common: commonSlice,
    profile: profileSlice,
    chat: chatSlice,
});

const store = configureStore({
    reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
