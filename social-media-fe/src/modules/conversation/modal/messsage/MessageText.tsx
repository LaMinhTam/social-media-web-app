import { MESSAGE_TYPE } from "@/constants/global";
import { MessageData } from "@/types/conversationType";
import handleFormatMessage from "@/utils/conversation/messages/handleFormatMessage";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";

const MessageText = ({
    message,
    type,
}: {
    message: MessageData;
    type: string;
}) => {
    return (
        <div
            className={`relative rounded-lg w-fit max-w-[212px] px-3 py-2 my-2 ${
                type === "send"
                    ? "bg-secondary text-lite ml-auto"
                    : "bg-strock text-text1 mr-auto"
            }`}
            style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
            }}
        >
            <p className="text-wrap">{handleFormatMessage(message)}</p>
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

export default MessageText;
