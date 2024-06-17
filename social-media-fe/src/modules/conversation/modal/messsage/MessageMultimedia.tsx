import { MESSAGE_TYPE } from "@/constants/global";
import { MessageData } from "@/types/conversationType";
import handleFormatMessage from "@/utils/conversation/messages/handleFormatMessage";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import MessageFile from "./MessageFile";
import MessageImage from "./MessageImage";
import MessageVideo from "./MessageVideo";

const MessageMultimedia = ({
    message,
    type,
}: {
    message: MessageData;
    type: string;
}) => {
    return (
        <>
            {[
                MESSAGE_TYPE.GIF,
                MESSAGE_TYPE.STICKER,
                MESSAGE_TYPE.EMOJI,
            ].includes(message.type) && (
                <div
                    className={`relative rounded-lg w-fit max-w-[212px] px-3 py-2 my-2 ${
                        type === "send" ? "ml-auto" : "mr-auto"
                    }`}
                >
                    {message.type === MESSAGE_TYPE.EMOJI && (
                        <p>{handleFormatMessage(message)}</p>
                    )}
                    {message.type === MESSAGE_TYPE.GIF && (
                        <img
                            src={handleFormatMessage(message)}
                            alt="gif"
                            className="object-cover w-full h-full rounded-lg"
                        />
                    )}
                    {message.type === MESSAGE_TYPE.STICKER && (
                        <img
                            src={handleFormatMessage(message)}
                            alt="sticker"
                            className="object-cover w-full h-[64px] rounded-lg"
                        />
                    )}
                    {message.type !== MESSAGE_TYPE.REVOKED &&
                        Object.keys(message.reactions ?? {}).length > 0 && (
                            <div className="flex items-center gap-x-1">
                                {Object.keys(message.reactions ?? {}).map(
                                    (reaction) => (
                                        <Button
                                            key={uuidv4()}
                                            className={`absolute bottom-[-20px] right-[-15px]`}
                                        >
                                            {handleRenderReactionMessage(
                                                reaction
                                            )}
                                        </Button>
                                    )
                                )}
                            </div>
                        )}
                </div>
            )}
            {message.type === MESSAGE_TYPE.FILE && (
                <MessageFile message={message} type={type}></MessageFile>
            )}
            {message.type === MESSAGE_TYPE.IMAGE && (
                <MessageImage message={message} type={type}></MessageImage>
            )}
            {message.type === MESSAGE_TYPE.VIDEO && (
                <MessageVideo message={message} type={type}></MessageVideo>
            )}
        </>
    );
};

export default MessageMultimedia;
