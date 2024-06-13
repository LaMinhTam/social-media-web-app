import { IconButton, Stack, Tooltip } from "@mui/material";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplyIcon from "@mui/icons-material/Reply";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
const MessageFeature = ({
    messageId,
    setIsOpen,
    handleReplyMessage,
}: {
    messageId: string;
    setIsOpen: (value: boolean) => void;
    handleReplyMessage: () => void;
}) => {
    return (
        <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
        >
            <Tooltip title="watch more" placement="top">
                <IconButton
                    size="small"
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    color="inherit"
                    className="w-7 h-7 btn-chat-action"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                >
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="reply message" placement="top">
                <IconButton
                    size="small"
                    aria-label="reply"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    color="inherit"
                    className="w-7 h-7"
                    onClick={handleReplyMessage}
                >
                    <ReplyIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="reaction message" placement="top">
                <IconButton
                    size="small"
                    aria-label="emoji"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    color="inherit"
                    className="w-7 h-7"
                >
                    <SentimentSatisfiedAltIcon />
                </IconButton>
            </Tooltip>
        </Stack>
    );
};

export default MessageFeature;
