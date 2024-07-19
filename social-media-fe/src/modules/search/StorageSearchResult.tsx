import { saveSearchResultToLocalStorage } from "@/utils/auth/handleLocalStorageSearch";
import { IconButton, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Dispatch } from "@reduxjs/toolkit";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { setSearchResult } from "@/store/actions/searchSlice";
import { Member } from "@/types/conversationType";
import { DEFAULT_AVATAR } from "@/constants/global";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";

const StorageSearchResult = ({
    user,
    storageSearchResult,
    setStorageSearchResult,
    dispatch,
    router,
}: {
    user: Member;
    storageSearchResult: Member[];
    setStorageSearchResult: React.Dispatch<React.SetStateAction<Member[]>>;
    dispatch: Dispatch<any>;
    router: AppRouterInstance;
}) => {
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    return (
        <div className="flex items-center justify-between p-2 rounded hover:bg-strock">
            <div
                className="flex items-center justify-center cursor-pointer gap-x-1"
                onClick={() => {
                    dispatch(setSearchResult([]));
                    if (user.user_id === currentUserProfile.user_id) {
                        router.push("/me");
                        return;
                    }
                    router.push(`/search/top?q=${user.name}`);
                }}
            >
                <Image
                    src={user.image_url ?? DEFAULT_AVATAR}
                    width={40}
                    height={40}
                    className="object-cover w-10 h-10 rounded-full"
                    alt={user.name}
                />
                <Typography>{user.name}</Typography>
            </div>
            <IconButton
                size="small"
                edge="end"
                color="secondary"
                aria-label="open drawer"
                className="btn-delete-search-result"
                sx={{ mr: 2 }}
                onClick={() => {
                    const isExist = storageSearchResult.some(
                        (item) => item.user_id === user.user_id
                    );
                    if (isExist) {
                        const newStorageSearchResult =
                            storageSearchResult.filter(
                                (item) => item.user_id !== user.user_id
                            );
                        saveSearchResultToLocalStorage(newStorageSearchResult);
                        setStorageSearchResult(newStorageSearchResult);
                    }
                }}
            >
                <CloseRoundedIcon />
            </IconButton>
        </div>
    );
};

export default StorageSearchResult;
