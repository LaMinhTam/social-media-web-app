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
import handleReduceAllReaction from "@/utils/conversation/messages/handleReduceAllReaction";
import { Member } from "@/types/conversationType";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const ReactionDialog = ({
    openReactionDialog,
    setOpenReactionDialog,
    reactions,
}: {
    openReactionDialog: boolean;
    setOpenReactionDialog: (value: boolean) => void;
    reactions: {
        [key: string]: number[];
    };
}) => {
    const currentConversation = useSelector(
        (state: RootState) => state.conversation.currentConversation
    );
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleClose = () => {
        setOpenReactionDialog(false);
    };

    const reactionAll = handleReduceAllReaction(reactions);

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openReactionDialog}
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
                Message reactions
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
                        reactionAll.map((item) => {
                            const user =
                                currentConversation.members[item.userId];
                            return (
                                <ReactionItem
                                    key={uuidv4()}
                                    user={user}
                                    count={item.count}
                                >
                                    {item.reactions.map((reaction) => (
                                        <span key={uuidv4()}>
                                            {handleRenderReactionMessage(
                                                reaction
                                            )}
                                        </span>
                                    ))}
                                </ReactionItem>
                            );
                        })}
                    {Object.keys(reactions).map((reaction, index) => {
                        // Aggregate reaction counts per user for this reaction type
                        const userReactionCounts = reactions[reaction].reduce<
                            Record<number, number>
                        >((acc, userId) => {
                            acc[userId] = (acc[userId] || 0) + 1;
                            return acc;
                        }, {});

                        return (
                            <Box
                                key={uuidv4()}
                                sx={{
                                    display:
                                        value === index + 1 ? "block" : "none",
                                }}
                            >
                                {Object.entries(userReactionCounts).map(
                                    ([userId, count]) => {
                                        const user =
                                            currentConversation.members[
                                                parseInt(userId, 10)
                                            ];

                                        if (!user) return null;

                                        return (
                                            <ReactionItem
                                                key={uuidv4()}
                                                user={user}
                                                count={count}
                                            >
                                                {handleRenderReactionMessage(
                                                    reaction
                                                )}
                                            </ReactionItem>
                                        );
                                    }
                                )}
                            </Box>
                        );
                    })}
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

export default ReactionDialog;
