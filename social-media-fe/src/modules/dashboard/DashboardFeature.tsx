import {
    Badge,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Popover,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import ConversationModal from "@/components/modal/ConversationModal";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/constants/firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import { useRouter } from "next/navigation";
import {
    getRefreshToken,
    saveAccessToken,
    saveRefreshToken,
    saveUser,
} from "@/utils/auth";
import MoreIcon from "@mui/icons-material/MoreVert";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import { SOCIAL_MEDIA_API } from "@/apis/constants";
import ResetPasswordDialog from "../profile/ResetPasswordDialog";
import NotificationModal from "@/components/modal/NotificationModal";
const DashboardFeature = () => {
    const router = useRouter();
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const refreshToken = getRefreshToken();
    const [openResetPasswordDialog, setOpenResetPasswordDialog] =
        useState<boolean>(false);
    const [unreadCount, setUnreadCount] = useState(0);
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

    const handleLogout = async () => {
        try {
            console.log("refreshToken", refreshToken);
            const response = await SOCIAL_MEDIA_API.AUTH.logout(
                refreshToken ?? ""
            );
            if (response.status === 200) {
                console.log("Logout successfully");
                handleMenuClose();
                saveAccessToken("");
                saveRefreshToken("");
                saveUser("");
                router.push("/signin");
            }
        } catch (error) {
            console.error(error);
        }
    };
    const notifications = useSelector(
        (state: RootState) => state.common.notifications
    );

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
                <Typography>{currentUserProfile.name}</Typography>
            </MenuItem>
            <MenuItem
                className="flex items-center justify-between gap-x-3 w-[360px]"
                onClick={() => setOpenResetPasswordDialog(true)}
            >
                <div className="flex items-center justify-center gap-x-3">
                    <RestartAltIcon />
                    <Typography>Reset Password</Typography>
                </div>
                <ToggleButtonGroup />
            </MenuItem>
            <MenuItem
                onClick={handleLogout}
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
            <PopupState
                variant="popover"
                popupId="message-popup-popover-mobile"
            >
                {(popupState) => (
                    <>
                        <MenuItem {...bindTrigger(popupState)}>
                            <IconButton
                                size="large"
                                aria-label="show 4 new mails"
                                color="inherit"
                            >
                                <Badge badgeContent={unreadCount} color="error">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                            <p>Messages</p>
                        </MenuItem>
                        <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                        >
                            <ConversationModal
                                popupState={popupState}
                            ></ConversationModal>
                        </Popover>
                    </>
                )}
            </PopupState>
            <PopupState
                variant="popover"
                popupId="notification-popup-popover-mobile"
            >
                {(popupState) => (
                    <>
                        <MenuItem {...bindTrigger(popupState)}>
                            <IconButton
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit"
                            >
                                {notifications && notifications.length > 0 ? (
                                    <Badge
                                        badgeContent={notifications.length}
                                        color="error"
                                    >
                                        <NotificationsIcon />
                                    </Badge>
                                ) : (
                                    <NotificationsIcon />
                                )}
                            </IconButton>
                            <p>Notifications</p>
                        </MenuItem>
                        <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                        >
                            <NotificationModal
                                popupState={popupState}
                            ></NotificationModal>
                        </Popover>
                    </>
                )}
            </PopupState>

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

    useEffect(() => {
        const fetchUnreadCount = () => {
            const unreadTrackCollection = collection(db, "unreadTrack");

            const unsubscribe = onSnapshot(
                unreadTrackCollection,
                (querySnapshot) => {
                    let totalUnread = 0;
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const isUserUnread = Object.keys(
                            data.list_unread_message
                        ).some(
                            (key) =>
                                parseInt(key) === currentUserProfile.user_id
                        );
                        if (isUserUnread)
                            totalUnread +=
                                data.list_unread_message[
                                    currentUserProfile.user_id
                                ].length;
                    });
                    setUnreadCount(totalUnread);
                }
            );

            // Clean up the listener when the component unmounts
            return () => unsubscribe();
        };

        fetchUnreadCount();
    }, [currentUserProfile.user_id]);
    return (
        <>
            <Box
                sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                }}
            >
                <PopupState variant="popover" popupId="message-popup-popover">
                    {(popupState) => (
                        <div>
                            <IconButton
                                {...bindTrigger(popupState)}
                                size="large"
                                aria-label="show 4 new mails"
                                color={popupState.isOpen ? "info" : "inherit"}
                                className={`flex items-center justify-center w-10 h-10 hover:text-primary ${
                                    popupState.isOpen
                                        ? "bg-secondary bg-opacity-5"
                                        : "bg-strock"
                                }`}
                            >
                                <Badge badgeContent={unreadCount} color="error">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                            <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                }}
                            >
                                <ConversationModal
                                    popupState={popupState}
                                ></ConversationModal>
                            </Popover>
                        </div>
                    )}
                </PopupState>
                <PopupState
                    variant="popover"
                    popupId="notification-popup-popover"
                >
                    {(popupState) => (
                        <div>
                            <IconButton
                                {...bindTrigger(popupState)}
                                size="large"
                                aria-label="show 4 new mails"
                                color={popupState.isOpen ? "info" : "inherit"}
                                className={`flex items-center justify-center w-10 h-10 hover:text-primary ${
                                    popupState.isOpen
                                        ? "bg-secondary bg-opacity-5"
                                        : "bg-strock"
                                }`}
                            >
                                {notifications && notifications.length > 0 ? (
                                    <Badge
                                        badgeContent={notifications.length}
                                        color="error"
                                    >
                                        <NotificationsIcon />
                                    </Badge>
                                ) : (
                                    <NotificationsIcon />
                                )}
                            </IconButton>
                            <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                }}
                            >
                                <NotificationModal
                                    popupState={popupState}
                                ></NotificationModal>
                            </Popover>
                        </div>
                    )}
                </PopupState>
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
            {renderMenu}
            {renderMobileMenu}
            {openResetPasswordDialog && (
                <ResetPasswordDialog
                    openResetPasswordDialog={openResetPasswordDialog}
                    setOpenResetPasswordDialog={setOpenResetPasswordDialog}
                />
            )}
        </>
    );
};

export default DashboardFeature;
