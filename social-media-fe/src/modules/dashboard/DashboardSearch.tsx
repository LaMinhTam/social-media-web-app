import {
    IconButton,
    InputBase,
    Typography,
    alpha,
    styled,
} from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import FacebookIcon from "@mui/icons-material/Facebook";
import Image from "next/image";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

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
                            size="small"
                            edge="start"
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center justify-center gap-x-1">
                                    <Image
                                        src="https://source.unsplash.com/random"
                                        width={40}
                                        height={40}
                                        className="object-cover w-10 h-10 rounded-full"
                                        alt="profile-pic"
                                    />
                                    <Typography>Thong Dinh</Typography>
                                </div>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    color="primary"
                                    aria-label="open drawer"
                                    sx={{ mr: 2 }}
                                >
                                    <CloseRoundedIcon />
                                </IconButton>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center justify-center gap-x-1">
                                    <Image
                                        src="https://source.unsplash.com/random"
                                        width={40}
                                        height={40}
                                        className="object-cover w-10 h-10 rounded-full"
                                        alt="profile-pic"
                                    />
                                    <Typography>Thong Dinh</Typography>
                                </div>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    color="primary"
                                    aria-label="open drawer"
                                    sx={{ mr: 2 }}
                                >
                                    <CloseRoundedIcon />
                                </IconButton>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardSearch;
