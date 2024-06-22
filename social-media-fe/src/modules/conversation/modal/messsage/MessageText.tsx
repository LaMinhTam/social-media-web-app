import { MESSAGE_TYPE } from "@/constants/global";
import { MessageData } from "@/types/conversationType";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import parse, {
    DOMNode,
    Element,
    HTMLReactParserOptions,
    domToReact,
} from "html-react-parser";
import formatTime from "@/utils/conversation/messages/handleGroupMessage";
import handleScrollToReplyMessage from "@/utils/conversation/messages/handleScrollToReplyMessage";
import { useSocket } from "@/contexts/socket-context";
import MessageReaction from "./MessageReaction";
import Link from "next/link";

const MessageText = ({
    message,
    type,
    isGroup,
}: {
    message: MessageData;
    type: string;
    isGroup: boolean;
}) => {
    const [messageFormat, setMessageFormat] = useState<string>("");
    const { messageRefs } = useSocket();
    let renderContent = "";
    if (message.reply_message?.type === MESSAGE_TYPE.TEXT) {
        renderContent = message.reply_message.content;
    } else if (message.reply_message?.type === MESSAGE_TYPE.IMAGE) {
        renderContent = "Image";
    } else if (message.reply_message?.type === MESSAGE_TYPE.VIDEO) {
        renderContent = "Video";
    } else if (message.reply_message?.type === MESSAGE_TYPE.FILE) {
        renderContent = "File";
    } else {
        renderContent = "Message";
    }

    useEffect(() => {
        const regex = /((http|https):\/\/[^\s]+)/g;
        const messageContent = message.content;
        if (messageContent.match(regex)) {
            const formattedMessage = messageContent.replace(
                regex,
                function (url) {
                    let linkJoinGroup = url.split("=")[1];
                    return `<a href="/join/group?groupId=${linkJoinGroup}" target="_blank" class="underline text-lite">${url}</a>`;
                }
            );
            setMessageFormat(formattedMessage);
        } else {
            setMessageFormat(messageContent);
        }
    }, []);
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (
                domNode instanceof Element &&
                domNode.attribs &&
                domNode.name === "a"
            ) {
                return (
                    <Link
                        href={domNode.attribs.href}
                        target="_blank"
                        className={`underline ${
                            type === "send" ? "text-lite" : "text-text1"
                        }`}
                    >
                        {domToReact((domNode as Element).children as DOMNode[])}
                    </Link>
                );
            }
        },
    };
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
            {isGroup && type === "receive" && (
                <>
                    <p className="text-xs text-text7">
                        {message.user_detail.name}
                    </p>
                </>
            )}
            {message.type !== MESSAGE_TYPE.REVOKED &&
                message.reply_message &&
                message.reply_message.message_id && (
                    <div
                        className={`w-full h-full px-2 py-3 rounded-lg cursor-pointer bg-strock shadow-sm`}
                        onClick={() =>
                            handleScrollToReplyMessage(
                                message.reply_message?.message_id ?? "",
                                messageRefs
                            )
                        }
                    >
                        <div className="flex items-center justify-center">
                            <div className="flex flex-col pl-2 border-l-2 border-l-secondary">
                                <span className="text-sm font-semibold text-text2">
                                    Thong Dinh
                                </span>
                                <span className="font-medium text-text3">
                                    {renderContent}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            <Tooltip title={formatTime(message.created_at)}>
                {/* <p className="text-wrap">{handleFormatMessage(message)}</p> */}
                <>{parse(messageFormat, options)}</>
            </Tooltip>
            <MessageReaction message={message}></MessageReaction>
        </div>
    );
};

export default MessageText;
