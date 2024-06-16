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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import CloseIcon from "@mui/icons-material/Close";
import { Member } from "@/types/conversationType";
import {
    setIsReplying,
    setMessageReply,
} from "@/store/actions/conversationSlice";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import MessageReply from "@/components/common/MessageReply";
import { GIF_URL_TRENDING_ENDPOINT, MESSAGE_TYPE } from "@/constants/global";
import useClickOutSide from "@/hooks/useClickOutSide";
import GIFPicker from "@/components/common/GIFPicker";
import axios from "@/apis/axios";
import { getTrendingGIFs } from "@/services/search.service";

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
    const dispatch = useDispatch();
    const {
        show: showEmojiPicker,
        setShow: setShowEmojiPicker,
        nodeRef: emojiPickerRef,
    } = useClickOutSide();
    const {
        show: showGIFPicker,
        setShow: setShowGIFPicker,
        nodeRef: gifPickerRef,
    } = useClickOutSide();
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const accessToken = getAccessToken();
    const [message, setMessage] = React.useState<string>("");
    const [GIFData, setGIFData] = React.useState<any>([]);
    const isReplying = useSelector(
        (state: RootState) => state.conversation.isReplying
    );
    const replyMessage = useSelector(
        (state: RootState) => state.conversation.messageReply
    );
    const handleSendMessage = () => {
        if (message.trim() === "") return;
        const chatMessage = {
            conversation_id: conversationId,
            content: message,
            type: message.length > 2 ? MESSAGE_TYPE.TEXT : MESSAGE_TYPE.EMOJI,
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

    const handleSendLikeMessage = () => {
        const chatMessage = {
            conversation_id: conversationId,
            content: "👍",
            type: MESSAGE_TYPE.EMOJI,
        };
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

    const handleChooseEmoji = (emoji: any) => {
        setMessage((prev) => prev + emoji.native);
        setShowEmojiPicker(false);
        setShowFullInput(true);
    };

    const handleShowGIFPicker = async () => {
        const trendingData = await getTrendingGIFs(100);
        if (trendingData) {
            setGIFData(trendingData.data);
            setShowGIFPicker(true);
        } else {
            console.log("No GIF found");
        }
    };

    return (
        <div className="z-50 w-full min-h-[60px] px-1 py-3 border-t shadow-md">
            {isReplying && (
                <MessageReply
                    name={
                        replyMessage.user_detail.name ===
                        currentUserProfile.name
                            ? "yourself"
                            : replyMessage.user_detail.name || "Unknown"
                    }
                    content={replyMessage.content}
                    dispatch={dispatch}
                ></MessageReply>
            )}

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
                                onClick={handleShowGIFPicker}
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
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
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
                            onClick={handleSendLikeMessage}
                        >
                            <ThumbUpRoundedIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {showEmojiPicker && (
                    <div
                        className="absolute right-0 z-50 bottom-12"
                        ref={emojiPickerRef}
                    >
                        <Picker data={data} onEmojiSelect={handleChooseEmoji} />
                    </div>
                )}
                {showGIFPicker && (
                    <div
                        className="absolute z-50 left-2 bottom-12"
                        ref={gifPickerRef}
                    >
                        <GIFPicker trendingData={GIFData}></GIFPicker>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalChatFooter;
