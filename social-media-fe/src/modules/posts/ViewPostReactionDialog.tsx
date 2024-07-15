import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Tab,
    Tabs,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { Member } from "@/types/conversationType";
import { ReactionPostDetailResponse } from "@/types/postType";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const ViewPostReactionDialog = ({
    openViewPostReactionDialog,
    setOpenViewPostReactionDialog,
    reactions,
}: {
    openViewPostReactionDialog: boolean;
    setOpenViewPostReactionDialog: (value: boolean) => void;
    reactions: ReactionPostDetailResponse;
}) => {
    const currentConversation = useSelector(
        (state: RootState) => state.conversation.currentConversation
    );
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleClose = () => {
        setOpenViewPostReactionDialog(false);
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openViewPostReactionDialog}
            onBackdropClick={handleClose}
        >
            {/* Existing DialogTitle and IconButton code remains unchanged */}
            <DialogContent dividers className="w-[548px] h-full p-4">
                <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                        >
                            <Tab label="All" />
                            {Object.keys(reactions).map((reaction, index) => (
                                <Tab
                                    key={index}
                                    label={handleRenderReactionMessage(
                                        reaction
                                    )}
                                />
                            ))}
                        </Tabs>
                    </Box>
                    {value === 0 &&
                        Object.entries(reactions).flatMap(([reaction, users]) =>
                            users.map((user) => (
                                <ReactionItem
                                    key={uuidv4()}
                                    user={user}
                                    count={1} // Assuming each user can only react once per reaction type
                                >
                                    {handleRenderReactionMessage(reaction)}
                                </ReactionItem>
                            ))
                        )}
                    {Object.keys(reactions).map((reaction, index) => (
                        <Box
                            key={uuidv4()}
                            sx={{
                                display: value === index + 1 ? "block" : "none",
                            }}
                        >
                            {reactions[reaction].map((user) => (
                                <ReactionItem
                                    key={uuidv4()}
                                    user={user}
                                    count={1} // Assuming each user can only react once per reaction type
                                >
                                    {handleRenderReactionMessage(reaction)}
                                </ReactionItem>
                            ))}
                        </Box>
                    ))}
                </Box>
            </DialogContent>
        </BootstrapDialog>
    );
};

const ReactionItem = ({
    user,
    count,
    children,
}: {
    user: Member;
    count: number;
    children: React.ReactNode;
}) => {
    return (
        <Box className="flex items-center justify-start w-full h-[56px] px-2 mt-2">
            <Box className="flex items-center justify-between flex-1 gap-x-1">
                <Box className="flex items-center gap-x-2">
                    <Image
                        src={
                            user?.image_url ??
                            "https://source.unsplash.com/random"
                        }
                        width={40}
                        height={40}
                        alt="avatar"
                        className="object-cover w-10 h-10 rounded-full"
                    />
                    <span>{user?.name}</span>
                </Box>
                <div>
                    {children}
                    <span className="text-xs font-semibold">{count}</span>
                </div>
            </Box>
        </Box>
    );
};

export default ViewPostReactionDialog;
