import { MESSAGE_TYPE } from "@/constants/global";
import { MessageData } from "@/types/conversationType";
import handleFormatMessage from "@/utils/conversation/messages/handleFormatMessage";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { Button, Tooltip } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";
import formatSize from "@/utils/conversation/messages/formatSize";
import { size } from "lodash";
import formatTime from "@/utils/conversation/messages/handleGroupMessage";
import MessageReaction from "./MessageReaction";

const MessageFile = ({
    message,
    type,
}: {
    message: MessageData;
    type: string;
}) => {
    const [url, fileName, fileSize] = message.content.split(";");
    return (
        <div
            className={`relative rounded-lg w-fit max-w-[212px] px-3 py-2 my-2 bg-strock ${
                type === "send" ? "ml-auto" : "mr-auto"
            }`}
        >
            <Tooltip title={formatTime(message.created_at)}>
                <div className="flex items-start gap-x-1">
                    <TextSnippetIcon />
                    <div className="flex flex-col gap-y-1">
                        <a href={url} target="_blank" rel="noreferrer" download>
                            {fileName}
                        </a>
                        <p className="text-xs text-text2">
                            {formatSize(Number(fileSize))}
                        </p>
                    </div>
                </div>
            </Tooltip>
            <MessageReaction message={message}></MessageReaction>
        </div>
    );
};

export default MessageFile;
