import { setSearchResult } from "@/store/actions/searchSlice";
import { Member } from "@/types/conversationType";
import { saveSearchResultToLocalStorage } from "@/utils/auth/handleLocalStorageSearch";
import { Typography } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import React from "react";

const SearchResult = ({
    user,
    storageSearchResult,
    dispatch,
    router,
}: {
    user: Member;
    storageSearchResult: Member[];
    dispatch: Dispatch<any>;
    router: AppRouterInstance;
}) => {
    return (
        <div
            className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-strock"
            onClick={() => {
                dispatch(setSearchResult([]));
                const isExist = storageSearchResult.some(
                    (item) => item.user_id === user.user_id
                );
                if (!isExist) {
                    storageSearchResult.push(user);
                    saveSearchResultToLocalStorage(storageSearchResult);
                }
                router.push(`/search/top?q=${user.name}`);
            }}
        >
            <div className="flex items-center justify-center gap-x-1">
                <Image
                    src={user.image_url ?? "https://source.unsplash.com/random"}
                    width={40}
                    height={40}
                    className="object-cover w-10 h-10 rounded-full"
                    alt={user.name}
                />
                <Typography>{user.name}</Typography>
            </div>
        </div>
    );
};

export default SearchResult;
