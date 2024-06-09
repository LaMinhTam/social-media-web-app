"use client";
import {
    Button,
    IconButton,
    InputBase,
    Typography,
    alpha,
    debounce,
    styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FacebookIcon from "@mui/icons-material/Facebook";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { SOCIAL_MEDIA_API } from "@/apis/constants";
import { useDispatch, useSelector } from "react-redux";
import { setSearchResult } from "@/store/actions/searchSlice";
import { RootState } from "@/store/configureStore";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { getSearchResultFromLocalStorage } from "@/utils/auth/handleLocalStorageSearch";
import StorageSearchResult from "../search/StorageSearchResult";
import SearchResult from "../search/SearchResult";
import { v4 as uuidv4 } from "uuid";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: 20,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));
const DashboardSearch = ({
    showSearch,
    setShowSearch,
    searchRef,
}: {
    showSearch: boolean;
    setShowSearch: (showSearch: boolean) => void;
    searchRef: React.RefObject<HTMLDivElement>;
}) => {
    const router = useRouter();
    const [searchValue, setSearchValue] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
    const searchResult = useSelector(
        (state: RootState) => state.search.searchResult
    );
    const [storageSearchResult, setStorageSearchResult] = useState(
        getSearchResultFromLocalStorage()
    );
    const dispatch = useDispatch();
    const useSearchDebounce = debounce(async (searchValue: string) => {
        try {
            setLoading(true);
            const response = await SOCIAL_MEDIA_API.USER.findUserByName(
                searchValue
            );
            if (response?.status === 200) {
                setLoading(false);
                dispatch(setSearchResult(response.data));
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }, 500);

    useEffect(() => {
        if (searchValue) {
            useSearchDebounce(searchValue);
        }
    }, [searchValue]);

    return (
        <div
            className={`bg-lite ${
                showSearch
                    ? "absolute z-50 top-0 left-0 shadow-md rounded-lg p-3"
                    : ""
            }`}
        >
            <div
                className={`w-[320px] flex flex-col ${
                    showSearch ? "h-full" : "h-[56px] mt-2"
                }`}
            >
                <div className="flex items-center justify-center">
                    {!showSearch ? (
                        <IconButton
                            size="small"
                            edge="start"
                            color="primary"
                            aria-label="open drawer"
                        >
                            <FacebookIcon className="w-10 h-full" />
                        </IconButton>
                    ) : (
                        <IconButton
                            size="large"
                            edge="end"
                            color="primary"
                            aria-label="open drawer"
                            onClick={() => setShowSearch(false)}
                        >
                            <ArrowBackRoundedIcon className="w-6 h-full" />
                        </IconButton>
                    )}
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ "aria-label": "search" }}
                            className="search-input"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSearch(true);
                            }}
                        />
                    </Search>
                </div>
                <div
                    className="flex flex-col flex-shrink-0 mt-2 gap-y-2"
                    ref={searchRef}
                >
                    {showSearch && (
                        <>
                            {loading && <LoadingSpinner />}
                            {searchResult.length > 0 && (
                                <>
                                    {searchValue && (
                                        <div
                                            className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-strock"
                                            onClick={() => {
                                                dispatch(setSearchResult([]));
                                                router.push(
                                                    `/search/top?q=${searchValue}`
                                                );
                                            }}
                                        >
                                            <div className="flex items-center justify-center gap-x-1">
                                                <Button
                                                    type="button"
                                                    variant="text"
                                                    color="inherit"
                                                    startIcon={<SearchIcon />}
                                                    sx={{
                                                        textTransform: "none",
                                                    }}
                                                >
                                                    <Typography>
                                                        {searchValue}
                                                    </Typography>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    {searchResult.map((user) => (
                                        <SearchResult
                                            key={uuidv4()}
                                            user={user}
                                            dispatch={dispatch}
                                            router={router}
                                            storageSearchResult={
                                                storageSearchResult
                                            }
                                        />
                                    ))}
                                </>
                            )}
                            {!loading &&
                                searchResult.length === 0 &&
                                storageSearchResult.length === 0 && (
                                    <Typography>No result found</Typography>
                                )}
                            {!searchValue &&
                                storageSearchResult.length > 0 &&
                                storageSearchResult.map((user) => (
                                    <StorageSearchResult
                                        key={uuidv4()}
                                        user={user}
                                        dispatch={dispatch}
                                        router={router}
                                        storageSearchResult={
                                            storageSearchResult
                                        }
                                        setStorageSearchResult={
                                            setStorageSearchResult
                                        }
                                    />
                                ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardSearch;
