import { MESSAGE_TYPE } from "@/constants/global";
import { MessageData } from "@/types/conversationType";
import handleFormatMessage from "@/utils/conversation/messages/handleFormatMessage";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";
import formatSize from "@/utils/conversation/messages/formatSize";
import { size } from "lodash";

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
            {message.type !== MESSAGE_TYPE.REVOKED &&
                Object.keys(message.reactions ?? {}).length > 0 && (
                    <div className="flex items-center gap-x-1">
                        {Object.keys(message.reactions ?? {}).map(
                            (reaction) => (
                                <Button
                                    key={uuidv4()}
                                    className={`absolute bottom-[-20px] right-[-15px]`}
                                >
                                    {handleRenderReactionMessage(reaction)}
                                </Button>
                            )
                        )}
                    </div>
                )}
        </div>
    );
};

export default MessageFile;
