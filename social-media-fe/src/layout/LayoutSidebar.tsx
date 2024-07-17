"use client";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
const LayoutSidebar = ({
    type = "friends",
    title = "Friends",
    children,
}: {
    type?: string;
    title?: string;
    children: React.ReactNode;
}) => {
    return (
        <Box className="w-[360px] h-full bg-lite shadow-lg">
            <Box className="flex items-center justify-between px-4 pt-5 pb-3">
                <Typography variant="h5">{title}</Typography>
                <IconButton
                    size="medium"
                    color="primary"
                    aria-label="settings"
                    type="button"
                >
                    {type === "friends" ? <SettingsIcon /> : null}
                </IconButton>
            </Box>
            {children}
        </Box>
    );
};

export default LayoutSidebar;
