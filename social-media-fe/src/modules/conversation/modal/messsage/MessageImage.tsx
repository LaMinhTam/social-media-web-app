import { MESSAGE_TYPE } from "@/constants/global";
import { MessageData } from "@/types/conversationType";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";

const MessageImage = ({
    message,
    type,
}: {
    message: MessageData;
    type: string;
}) => {
    const [url, fileName, fileSize] = message.content.split(";");
    return (
        <div>
            <div
                className={`relative rounded-lg w-fit max-w-[212px] px-3 py-2 my-2 ${
                    type === "send" ? "ml-auto" : "mr-auto"
                }`}
            >
                <img
                    src={url}
                    alt="gif"
                    className="object-cover w-full h-[200px] rounded-lg"
                />
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
        </div>
    );
};

export default MessageImage;
