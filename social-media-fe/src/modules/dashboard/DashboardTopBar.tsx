"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Typography } from "@mui/material";
import ToggleButton from "@/components/button/ToggleButton";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import DashboardSearch from "./DashboardSearch";
import useClickOutSide from "@/hooks/useClickOutSide";
import { useRouter } from "next/navigation";

export default function DashboardTopBar() {
    const router = useRouter();
    const [currentTab, setCurrentTab] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            id={menuId}
            keepMounted
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem
                onClick={() => router.push("/me")}
                className="flex items-center justify-start gap-x-3 w-[360px]"
            >
                <AccountCircle />
                <Typography>Thong Dinh</Typography>
            </MenuItem>
            <MenuItem className="flex items-center justify-between gap-x-3 w-[360px]">
                <div className="flex items-center justify-center gap-x-3">
                    <DarkModeIcon />
                    <Typography>Dark/Light</Typography>
                </div>
                <ToggleButton checked={true} text="" />
            </MenuItem>
            <MenuItem
                onClick={handleMenuClose}
                className="flex items-center justify-start gap-x-3 w-[360px]"
            >
                <LogoutIcon />
                <Typography>Logout</Typography>
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                >
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const {
        show: showSearch,
        setShow: setShowSearch,
        nodeRef: searchRef,
    } = useClickOutSide("button");

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" className="bg-lite text-text1">
                <Toolbar>
                    <DashboardSearch
                        showSearch={showSearch}
                        setShowSearch={setShowSearch}
                        searchRef={searchRef}
                    ></DashboardSearch>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: showSearch ? "320px" : 0,
                        }}
                    >
                        <button
                            className={`flex items-center justify-center w-[112px] h-[56px] 
                            flex-shrink-0 hover:text-secondary ${
                                currentTab === 0
                                    ? "border-b-4 border-secondary"
                                    : ""
                            }`}
                            onClick={() => setCurrentTab(0)}
                        >
                            <HomeIcon
                                className={`w-8 h-8 ${
                                    currentTab === 0 ? "text-secondary" : ""
                                }`}
                            />
                        </button>
                        <button
                            className={`flex items-center justify-center w-[112px] h-[56px] 
                            flex-shrink-0 hover:text-secondary ${
                                currentTab === 1
                                    ? "border-b-4 border-secondary"
                                    : ""
                            }`}
                            onClick={() => setCurrentTab(1)}
                        >
                            <PeopleOutlineRoundedIcon
                                className={`w-8 h-8 ${
                                    currentTab === 1 ? "text-secondary" : ""
                                }`}
                            />
                        </button>
                    </Box>
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
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}
