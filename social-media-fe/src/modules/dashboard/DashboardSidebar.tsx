"use client";
import { Box, Button, IconButton, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import BlockIcon from "@mui/icons-material/Block";
import RedeemIcon from "@mui/icons-material/Redeem";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

const DashboardSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [tab, setTab] = React.useState(pathname);
    return (
        <Box className="w-[360px] h-full bg-lite shadow-lg">
            <Box className="flex items-center justify-between px-4 pt-5 pb-3">
                <Typography variant="h5">Bạn bè</Typography>
                <IconButton
                    size="medium"
                    color="primary"
                    aria-label="settings"
                    type="button"
                >
                    <SettingsIcon />
                </IconButton>
            </Box>
            <Box>
                <Button
                    className="flex items-center justify-start w-full px-4 py-3 normal-case"
                    startIcon={<PeopleIcon />}
                    variant={tab === "/friends" ? "contained" : "text"}
                    color={tab === "/friends" ? "primary" : "inherit"}
                    onClick={() => router.push("/friends")}
                >
                    <Typography className="font-medium">Trang chủ</Typography>
                </Button>
                <Button
                    className="flex items-center justify-start w-full px-4 py-3 normal-case"
                    startIcon={<PersonAddAlt1Icon />}
                    variant={tab === "/friends/request" ? "contained" : "text"}
                    color={tab === "/friends/request" ? "primary" : "inherit"}
                    onClick={() => router.push("/friends/request")}
                >
                    <Typography className="font-medium">
                        Lời mời kết bạn
                    </Typography>
                </Button>
                <Button
                    className="flex items-center justify-start w-full px-4 py-3 normal-case"
                    startIcon={<RedeemIcon />}
                    variant={
                        tab === "/friends/birthdays" ? "contained" : "text"
                    }
                    color={tab === "/friends/birthdays" ? "primary" : "inherit"}
                    onClick={() => router.push("/friends/birthdays")}
                >
                    <Typography className="font-medium">Sinh nhật</Typography>
                </Button>
                <Button
                    className="flex items-center justify-start w-full px-4 py-3 normal-case"
                    startIcon={<BlockIcon />}
                    variant={tab === "/friends/blocks" ? "contained" : "text"}
                    color={tab === "/friends/blocks" ? "primary" : "inherit"}
                    onClick={() => router.push("/friends/blocks")}
                >
                    <Typography className="font-medium">
                        Danh sách người dùng bị chặn
                    </Typography>
                </Button>
            </Box>
        </Box>
    );
};

export default DashboardSidebar;
