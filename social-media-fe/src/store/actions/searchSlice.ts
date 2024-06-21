import { UserResponse } from "@/types/userType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SearchType = {
    searchResult: UserResponse[];
};

const initialState: SearchType = {
    searchResult: [] as UserResponse[],
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchResult(state, action: PayloadAction<UserResponse[]>) {
            state.searchResult = action.payload;
        },
    },
});

export const { setSearchResult } = searchSlice.actions;
export default searchSlice.reducer;
