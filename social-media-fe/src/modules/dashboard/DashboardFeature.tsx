import { Badge, Box, IconButton, Popover } from "@mui/material";
import React from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import ConversationModal from "@/components/modal/ConversationModal";
const DashboardFeature = ({
    handleProfileMenuOpen,
    menuId,
}: {
    handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    menuId: string;
}) => {
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
                                <Badge badgeContent={4} color="error">
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
