import { MESSAGE_TYPE } from "@/constants/global";
import { MessageData } from "@/types/conversationType";
import handleFormatMessage from "@/utils/conversation/messages/handleFormatMessage";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";
import { Button, Tooltip } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import MessageFile from "./MessageFile";
import MessageImage from "./MessageImage";
import MessageVideo from "./MessageVideo";
import formatTime from "@/utils/conversation/messages/handleGroupMessage";

const MessageMultimedia = ({
    message,
    type,
    isGroup,
}: {
    message: MessageData;
    type: string;
    isGroup: boolean;
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
                    {isGroup && type === "receive" && (
                        <div className="absolute left-0 -top-5">
                            <p className="text-xs text-gray-500">
                                {message.user_detail.name}
                            </p>
                        </div>
                    )}
                    {message.type === MESSAGE_TYPE.EMOJI && (
                        <Tooltip title={formatTime(message.created_at)}>
                            <p>{handleFormatMessage(message)}</p>
                        </Tooltip>
                    )}
                    {message.type === MESSAGE_TYPE.GIF && (
                        <Tooltip title={formatTime(message.created_at)}>
                            <img
                                src={handleFormatMessage(message)}
                                alt="gif"
                                className="object-cover w-full h-full rounded-lg"
                            />
                        </Tooltip>
                    )}
                    {message.type === MESSAGE_TYPE.STICKER && (
                        <Tooltip title={formatTime(message.created_at)}>
                            <img
                                src={handleFormatMessage(message)}
                                alt="sticker"
                                className="object-cover w-full h-[64px] rounded-lg"
                            />
                        </Tooltip>
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
