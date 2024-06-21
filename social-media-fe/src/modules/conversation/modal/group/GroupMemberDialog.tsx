import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Popover,
    Tab,
    Tabs,
    Typography,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, { useState } from "react";
import { ConversationResponse } from "@/types/conversationType";
import Image from "next/image";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import GroupMemberAction from "./GroupMemberAction";
import { v4 as uuidv4 } from "uuid";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const GroupMemberDialog = ({
    currentUserId,
    currentConversation,
    openGroupMemberDialog,
    setOpenGroupMemberDialog,
}: {
    currentUserId: number;
    currentConversation: ConversationResponse;
    openGroupMemberDialog: boolean;
    setOpenGroupMemberDialog: (open: boolean) => void;
}) => {
    const [value, setValue] = useState(0);
    const listMembers = Object.values(currentConversation.members).filter(
        (member) => member.user_id !== currentConversation.owner_id
    );
    const listAdmins = Object.values(currentConversation.members).filter(
        (member) => member.user_id === currentConversation.owner_id
    );
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleClose = () => {
        setOpenGroupMemberDialog(false);
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openGroupMemberDialog}
            onBackdropClick={handleClose}
        >
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2,
                    textAlign: "center",
                    fontWeight: 700,
                }}
                id="customized-dialog-title"
            >
                Members
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers className="w-[548px] h-full">
                <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                        >
                            <Tab label="All" />
                            <Tab label="Admin" />
                        </Tabs>
                    </Box>
                    {value === 0 && (
                        <Box sx={{ p: 3 }}>
                            {listMembers.map((member) => (
                                <Box
                                    key={uuidv4()}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        my: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <Image
                                            src={member.image_url}
                                            alt=""
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full rounded-full"
                                        />
                                    </Box>
                                    <Box>
                                        <Typography className="font-bold">
                                            {member.name}
                                        </Typography>
                                        <Typography className="text-sm text-gray-500">
                                            Added by Admin
                                        </Typography>
                                    </Box>
                                    <PopupState
                                        variant="popover"
                                        popupId="group-popup-popover"
                                    >
                                        {(popupState) => (
                                            <div className="ml-auto">
                                                <IconButton
                                                    size="small"
                                                    color="inherit"
                                                    {...bindTrigger(popupState)}
                                                >
                                                    <MoreHorizIcon />
                                                </IconButton>
                                                <Popover
                                                    {...bindPopover(popupState)}
                                                    anchorOrigin={{
                                                        vertical: "bottom",
                                                        horizontal: "left",
                                                    }}
                                                    transformOrigin={{
                                                        vertical: "top",
                                                        horizontal: "right",
                                                    }}
                                                >
                                                    <GroupMemberAction
                                                        userRole={
                                                            currentConversation.owner_id ===
                                                            currentUserId
                                                                ? "ADMIN"
                                                                : "MEMBER"
                                                        }
                                                        targetUserRole="MEMBER"
                                                        userId={member.user_id}
                                                        conversationId={
                                                            currentConversation.conversation_id
                                                        }
                                                        popupState={popupState}
                                                    ></GroupMemberAction>
                                                </Popover>
                                            </div>
                                        )}
                                    </PopupState>
                                </Box>
                            ))}
                        </Box>
                    )}
                    {value === 1 && (
                        <Box sx={{ p: 3 }}>
                            {listAdmins.map((member) => (
                                <Box
                                    key={uuidv4()}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        my: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <Image
                                            src={member.image_url}
                                            alt=""
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full rounded-full"
                                        />
                                    </Box>
                                    <Box>
                                        <Typography className="font-bold">
                                            {member.name}
                                        </Typography>
                                        <Typography className="text-sm text-gray-500">
                                            Admin
                                        </Typography>
                                    </Box>
                                    <PopupState
                                        variant="popover"
                                        popupId="group-popup-popover"
                                    >
                                        {(popupState) => (
                                            <div className="ml-auto">
                                                <IconButton
                                                    size="small"
                                                    color="inherit"
                                                    {...bindTrigger(popupState)}
                                                >
                                                    <MoreHorizIcon />
                                                </IconButton>
                                                <Popover
                                                    {...bindPopover(popupState)}
                                                    anchorOrigin={{
                                                        vertical: "bottom",
                                                        horizontal: "left",
                                                    }}
                                                    transformOrigin={{
                                                        vertical: "top",
                                                        horizontal: "right",
                                                    }}
                                                >
                                                    <GroupMemberAction
                                                        userRole={
                                                            currentConversation.owner_id ===
                                                            currentUserId
                                                                ? "ADMIN"
                                                                : "MEMBER"
                                                        }
                                                        targetUserRole="MEMBER"
                                                        userId={member.user_id}
                                                        conversationId={
                                                            currentConversation.conversation_id
                                                        }
                                                        popupState={popupState}
                                                    ></GroupMemberAction>
                                                </Popover>
                                            </div>
                                        )}
                                    </PopupState>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </DialogContent>
        </BootstrapDialog>
    );
};

export default GroupMemberDialog;
