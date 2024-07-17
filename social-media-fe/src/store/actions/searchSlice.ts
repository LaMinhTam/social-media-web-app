import { Member } from "@/types/conversationType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SearchType = {
    searchResult: Member[];
};

const initialState: SearchType = {
    searchResult: [] as Member[],
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchResult(state, action: PayloadAction<Member[]>) {
            state.searchResult = action.payload;
        },
    },
});

export const { setSearchResult } = searchSlice.actions;
export default searchSlice.reducer;
