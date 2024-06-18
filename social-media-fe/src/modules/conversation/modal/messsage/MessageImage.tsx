import { MESSAGE_TYPE } from "@/constants/global";
import { MessageData } from "@/types/conversationType";
import { Button, Tooltip } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";
import formatTime from "@/utils/conversation/messages/handleGroupMessage";
import MessageReaction from "./MessageReaction";

const MessageImage = ({
    message,
    type,
}: {
    message: MessageData;
    type: string;
}) => {
    const [url, fileName, fileSize] = message.content.split(";");
    return (
        <div
            className={`relative rounded-lg w-fit max-w-[212px] px-3 py-2 my-2 ${
                type === "send" ? "ml-auto" : "mr-auto"
            }`}
        >
            <Tooltip title={formatTime(message.created_at)}>
                <img
                    src={url}
                    alt="gif"
                    className="object-cover w-full h-[200px] rounded-lg"
                />
            </Tooltip>
            <MessageReaction message={message}></MessageReaction>
        </div>
    );
};

export default MessageImage;
