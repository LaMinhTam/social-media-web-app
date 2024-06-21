import { Badge, Box, IconButton, Popover } from "@mui/material";
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
const DashboardFeature = ({
    handleProfileMenuOpen,
    menuId,
}: {
    handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    menuId: string;
}) => {
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const [unreadCount, setUnreadCount] = useState(0);

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
        </>
    );
};

export default DashboardFeature;
