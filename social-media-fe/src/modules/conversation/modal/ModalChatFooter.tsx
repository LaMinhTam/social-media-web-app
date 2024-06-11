import { IconButton, TextareaAutosize } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import GifIcon from "@mui/icons-material/Gif";
import LabelIcon from "@mui/icons-material/Label";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SendIcon from "@mui/icons-material/Send";
import React from "react";

const ModalChatFooter = ({
    isActive,
    setIsActive,
    showFullInput,
    setShowFullInput,
    setMessage,
    setMessageShow,
    activeRef,
    message,
}: {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    showFullInput: boolean;
    setShowFullInput: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setMessageShow: React.Dispatch<React.SetStateAction<string>>;
    activeRef: React.RefObject<HTMLDivElement>;
    message: string;
}) => {
    return (
        <div className="z-50 w-full min-h-[60px] px-1 py-3 border-t shadow-md flex-shrink-0">
            <div className="flex items-center w-full">
                {showFullInput ? (
                    <IconButton
                        size="small"
                        color={isActive ? "info" : "inherit"}
                        aria-label="Gửi clip âm thanh"
                        className="btn-chat-action"
                    >
                        <AddOutlinedIcon />
                    </IconButton>
                ) : (
                    <div className="flex items-center justify-start">
                        <IconButton
                            size="small"
                            color={isActive ? "info" : "inherit"}
                            aria-label="Gửi clip âm thanh"
                            className="btn-chat-action"
                        >
                            <MicIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            color={isActive ? "info" : "inherit"}
                            aria-label="Đính kèm file"
                            className="btn-chat-action"
                        >
                            <PhotoLibraryIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            color={isActive ? "info" : "inherit"}
                            aria-label="Chọn nhãn dán"
                            className="btn-chat-action"
                        >
                            <LabelIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            color={isActive ? "info" : "inherit"}
                            aria-label="Chọn file GIF"
                            className="btn-chat-action"
                        >
                            <GifIcon />
                        </IconButton>
                    </div>
                )}
                <div
                    className="relative flex-1 min-h-[36px] overflow-y-auto overflow-x-hidden pr-7 rounded-lg 
                            bg-strock"
                    ref={activeRef}
                >
                    <TextareaAutosize
                        placeholder="Aa"
                        className="py-[6px] px-2 w-full min-w-[136px] h-full resize-none text-[15px] outline-none bg-strock"
                        maxRows={3}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setShowFullInput(false);
                            } else {
                                setShowFullInput(true);
                                setMessage(e.target.value);
                            }
                        }}
                        onFocus={() => setIsActive(true)}
                    ></TextareaAutosize>
                    <IconButton
                        size="small"
                        color={isActive ? "info" : "inherit"}
                        className="absolute right-0 transform -translate-y-1/2 top-1/2 btn-chat-action w-7 h-7"
                    >
                        <SentimentVerySatisfiedIcon />
                    </IconButton>
                </div>
                {showFullInput ? (
                    <IconButton
                        size="small"
                        color={isActive ? "info" : "inherit"}
                        aria-label="Thích"
                        className="btn-chat-action"
                        onClick={() => setMessageShow(message)}
                    >
                        <SendIcon />
                    </IconButton>
                ) : (
                    <IconButton
                        size="small"
                        color={isActive ? "info" : "inherit"}
                        aria-label="Thích"
                        className="btn-chat-action"
                        onClick={() => setMessage("")}
                    >
                        <ThumbUpRoundedIcon />
                    </IconButton>
                )}
            </div>
        </div>
    );
};

export default ModalChatFooter;
