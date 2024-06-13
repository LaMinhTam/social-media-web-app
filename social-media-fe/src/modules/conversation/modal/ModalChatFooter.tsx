import { IconButton, TextareaAutosize, Tooltip } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import GifIcon from "@mui/icons-material/Gif";
import LabelIcon from "@mui/icons-material/Label";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import { Client } from "stompjs";
import { getAccessToken } from "@/utils/auth";

const ModalChatFooter = ({
    isActive,
    setIsActive,
    showFullInput,
    setShowFullInput,
    activeRef,
    stompClient,
    conversationId,
}: {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    showFullInput: boolean;
    setShowFullInput: React.Dispatch<React.SetStateAction<boolean>>;
    activeRef: React.RefObject<HTMLDivElement>;
    stompClient: Client;
    conversationId: string;
}) => {
    const accessToken = getAccessToken();
    const [message, setMessage] = React.useState<string>("");
    const handleSendMessage = () => {
        if (message.trim() === "") return;
        const chatMessage = {
            conversation_id: conversationId,
            content: message,
            type: "TEXT",
        };
        setMessage("");
        stompClient.send(
            "/app/message",
            {
                Authorization: accessToken,
            },
            JSON.stringify(chatMessage)
        );
    };

    const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.shiftKey === false) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="z-50 w-full min-h-[60px] px-1 py-3 border-t shadow-md">
            <div className="flex items-center w-full">
                {showFullInput ? (
                    <Tooltip title="More action">
                        <IconButton
                            size="small"
                            color={isActive ? "info" : "inherit"}
                            aria-label="Gửi clip âm thanh"
                            className="btn-chat-action"
                        >
                            <AddOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <div className="flex items-center justify-start">
                        <Tooltip title="Send audio clip">
                            <IconButton
                                size="small"
                                color={isActive ? "info" : "inherit"}
                                aria-label="Gửi clip âm thanh"
                                className="btn-chat-action"
                            >
                                <MicIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Send file">
                            <IconButton
                                size="small"
                                color={isActive ? "info" : "inherit"}
                                aria-label="Đính kèm file"
                                className="btn-chat-action"
                            >
                                <PhotoLibraryIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Send sticker">
                            <IconButton
                                size="small"
                                color={isActive ? "info" : "inherit"}
                                aria-label="Chọn nhãn dán"
                                className="btn-chat-action"
                            >
                                <LabelIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Send GIF">
                            <IconButton
                                size="small"
                                color={isActive ? "info" : "inherit"}
                                aria-label="Chọn file GIF"
                                className="btn-chat-action"
                            >
                                <GifIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}
                <div
                    className="relative flex-1 w-full min-h-[36px] overflow-y-auto overflow-x-hidden pr-7 rounded-lg 
                            bg-strock custom-scrollbar"
                    ref={activeRef}
                >
                    <TextareaAutosize
                        placeholder="Aa"
                        className="py-[6px] px-2 w-full min-w-[136px] h-full resize-none text-[15px] outline-none bg-strock"
                        maxRows={3}
                        value={message}
                        onChange={(e) => {
                            setShowFullInput(e.target.value.length > 0);
                            setMessage(e.target.value);
                        }}
                        onFocus={() => setIsActive(true)}
                        onKeyDown={onEnterPress}
                    ></TextareaAutosize>
                    <Tooltip title="Send Emoji">
                        <IconButton
                            size="small"
                            color={isActive ? "info" : "inherit"}
                            className="absolute right-0 transform -translate-y-1/2 top-1/2 btn-chat-action w-7 h-7"
                        >
                            <SentimentVerySatisfiedIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                {showFullInput ? (
                    <Tooltip title="Press enter to send">
                        <IconButton
                            size="small"
                            color={isActive ? "info" : "inherit"}
                            aria-label="Thích"
                            className="btn-chat-action"
                            onClick={handleSendMessage}
                        >
                            <SendIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Send Like">
                        <IconButton
                            size="small"
                            color={isActive ? "info" : "inherit"}
                            aria-label="Thích"
                            className="btn-chat-action"
                            onClick={() => {}}
                        >
                            <ThumbUpRoundedIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};

export default ModalChatFooter;
