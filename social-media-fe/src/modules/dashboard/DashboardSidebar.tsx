"use client";
import { Box, Button, IconButton, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import BlockIcon from "@mui/icons-material/Block";
import PersonSearchSharpIcon from "@mui/icons-material/PersonSearchSharp";
import RedeemIcon from "@mui/icons-material/Redeem";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import LayoutSidebar from "@/layout/LayoutSidebar";

const DashboardSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [tab, setTab] = React.useState(pathname);
    return (
        <LayoutSidebar>
            <Box>
                <Button
                    className="flex items-center justify-start w-full px-4 py-3 normal-case"
                    startIcon={<PeopleIcon />}
                    variant={tab === "/friends" ? "contained" : "text"}
                    color={tab === "/friends" ? "primary" : "inherit"}
                    onClick={() => {
                        router.push("/friends");
                        setTab("/friends");
                    }}
                >
                    <Typography className="font-medium">Home</Typography>
                </Button>
                <Button
                    className="flex items-center justify-start w-full px-4 py-3 normal-case"
                    startIcon={<PersonAddAlt1Icon />}
                    variant={tab === "/friends/request" ? "contained" : "text"}
                    color={tab === "/friends/request" ? "primary" : "inherit"}
                    onClick={() => {
                        router.push("/friends/request");
                        setTab("/friends/request");
                    }}
                >
                    <Typography className="font-medium">
                        Friend requests
                    </Typography>
                </Button>
                <Button
                    className="flex items-center justify-start w-full px-4 py-3 normal-case"
                    startIcon={<PersonSearchSharpIcon />}
                    variant={tab === "/friends/list" ? "contained" : "text"}
                    color={tab === "/friends/list" ? "primary" : "inherit"}
                    onClick={() => {
                        router.push("/friends/list");
                        setTab("/friends/list");
                    }}
                >
                    <Typography className="font-medium">All friends</Typography>
                </Button>
                <Button
                    className="flex items-center justify-start w-full px-4 py-3 normal-case"
                    startIcon={<RedeemIcon />}
                    variant={
                        tab === "/friends/birthdays" ? "contained" : "text"
                    }
                    color={tab === "/friends/birthdays" ? "primary" : "inherit"}
                    onClick={() => {
                        router.push("/friends/birthdays");
                        setTab("/friends/birthdays");
                    }}
                >
                    <Typography className="font-medium">Birthday</Typography>
                </Button>
                <Button
                    className="flex items-center justify-start w-full px-4 py-3 normal-case"
                    startIcon={<BlockIcon />}
                    variant={tab === "/friends/blocks" ? "contained" : "text"}
                    color={tab === "/friends/blocks" ? "primary" : "inherit"}
                    onClick={() => {
                        router.push("/friends/blocks");
                        setTab("/friends/blocks");
                    }}
                >
                    <Typography className="font-medium">
                        Blocked friends
                    </Typography>
                </Button>
            </Box>
        </LayoutSidebar>
    );
};

export default DashboardSidebar;
