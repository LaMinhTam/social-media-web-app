import { Box, Button, Typography } from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PeopleIcon from "@mui/icons-material/People";
import React from "react";
import { useRouter } from "next/navigation";

const SearchSession = ({
    query,
    pathname,
}: {
    query: string;
    pathname: string;
}) => {
    const [tab, setTab] = React.useState(`${pathname}?q=${query}`);
    const router = useRouter();
    return (
        <Box>
            <Button
                className="flex items-center justify-start w-full px-4 py-3 normal-case"
                startIcon={<CollectionsIcon />}
                variant={tab.includes("/top") ? "contained" : "text"}
                color={tab.includes("/top") ? "primary" : "inherit"}
                onClick={() => {
                    setTab(`/search/top?q=${query}`);
                    router.push(`/search/top?q=${query}`);
                }}
            >
                <Typography className="font-medium">All </Typography>
            </Button>
            <Button
                className="flex items-center justify-start w-full px-4 py-3 normal-case"
                startIcon={<PostAddIcon />}
                variant={tab.includes("/post") ? "contained" : "text"}
                color={tab.includes("/post") ? "primary" : "inherit"}
                onClick={() => {
                    setTab(`/search/post?q=${query}`);
                    router.push(`/search/post?q=${query}`);
                }}
            >
                <Typography className="font-medium">Post</Typography>
            </Button>
            <Button
                className="flex items-center justify-start w-full px-4 py-3 normal-case"
                startIcon={<PeopleIcon />}
                variant={tab.includes("/people") ? "contained" : "text"}
                color={tab.includes("/people") ? "primary" : "inherit"}
                onClick={() => {
                    setTab(`/search/people?q=${query}`);
                    router.push(`/search/people?q=${query}`);
                }}
            >
                <Typography className="font-medium">People</Typography>
            </Button>
        </Box>
    );
};

export default SearchSession;
