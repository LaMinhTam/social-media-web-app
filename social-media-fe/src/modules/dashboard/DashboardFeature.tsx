import { Badge, Box, IconButton } from "@mui/material";
import React from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
const DashboardFeature = ({
    handleProfileMenuOpen,
    menuId,
}: {
    handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    menuId: string;
}) => {
    return (
        <Box
            sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
            }}
        >
            <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                className="flex items-center justify-center w-10 h-10 bg-strock hover:text-primary"
            >
                <Badge badgeContent={4} color="error">
                    <MailIcon />
                </Badge>
            </IconButton>
            <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                className="flex items-center justify-center w-10 h-10 bg-strock hover:text-primary"
            >
                <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                className="flex items-center justify-center w-10 h-10 bg-strock hover:text-primary"
            >
                <AccountCircle />
            </IconButton>
        </Box>
    );
};

export default DashboardFeature;
