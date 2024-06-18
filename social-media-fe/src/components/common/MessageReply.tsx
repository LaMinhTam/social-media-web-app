import {
    setIsReplying,
    setMessageReply,
} from "@/store/actions/conversationSlice";
import { IconButton } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { MESSAGE_TYPE } from "@/constants/global";

const MessageReply = ({
    name,
    content,
    dispatch,
    messageType,
}: {
    name: string;
    content: string;
    dispatch: Dispatch<any>;
    messageType: string;
}) => {
    let renderContent = "";
    if (messageType === MESSAGE_TYPE.TEXT) {
        renderContent = content;
    } else if (messageType === MESSAGE_TYPE.IMAGE) {
        renderContent = "Image";
    } else if (messageType === MESSAGE_TYPE.VIDEO) {
        renderContent = "Video";
    } else if (messageType === MESSAGE_TYPE.FILE) {
        renderContent = "File";
    }
    return (
        <div className="flex items-center justify-between w-full px-2 py-1 mb-2 rounded-lg bg-strock">
            <div className="flex flex-col gap-y-2">
                <p className="text-sm">
                    Replying to{" "}
                    <strong className="text-secondary">{name}</strong>
                </p>
                <p className="text-sm text-secondary">{renderContent}</p>
            </div>
            <IconButton
                size="small"
                color="primary"
                onClick={() => {
                    dispatch(setIsReplying(false));
                    dispatch(setMessageReply({} as any));
                }}
            >
                <CloseIcon />
            </IconButton>
        </div>
    );
};

export default MessageReply;
