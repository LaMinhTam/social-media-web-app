import { DEFAULT_AVATAR } from "@/constants/global";
import { setSearchResult } from "@/store/actions/searchSlice";
import { RootState } from "@/store/configureStore";
import { Member } from "@/types/conversationType";
import { saveSearchResultToLocalStorage } from "@/utils/auth/handleLocalStorageSearch";
import { Typography } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

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
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    return (
        <div
            className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-strock"
            onClick={() => {
                console.log("Run search click event");
                dispatch(setSearchResult([]));
                const isExist = storageSearchResult.some(
                    (item) => item.user_id === user.user_id
                );
                if (!isExist) {
                    storageSearchResult.push(user);
                    saveSearchResultToLocalStorage(storageSearchResult);
                }
                if (user.user_id === currentUserProfile.user_id) {
                    router.push("/me");
                    return;
                }
                router.push(`/search/top?q=${user.name}`);
            }}
        >
            <div className="flex items-center justify-center gap-x-1">
                <Image
                    src={user.image_url ?? DEFAULT_AVATAR}
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
