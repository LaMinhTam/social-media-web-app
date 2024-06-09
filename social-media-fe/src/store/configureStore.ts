import { configureStore, combineReducers } from "@reduxjs/toolkit";
import searchSlice from "./actions/searchSlice";
import userSlice from "./actions/userSlice";
import commonSlice from "./actions/commonSlice";

const reducer = combineReducers({
    user: userSlice,
    search: searchSlice,
    common: commonSlice,
});

const store = configureStore({
    reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
