import { Box, IconButton, Tooltip } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import GifIcon from "@mui/icons-material/Gif";
import LabelIcon from "@mui/icons-material/Label";
import React, { useRef } from "react";
import axios from "@/apis/axios";
import { Client } from "stompjs";
import { useDispatch } from "react-redux";
import { MESSAGE_TYPE } from "@/constants/global";
import { getAccessToken } from "@/utils/auth";

const ChatFeature = ({
    isActive,
    handleShowStickerPicker,
    handleShowGIFPicker,
    conversationId,
    stompClient,
}: {
    isActive: boolean;
    handleShowStickerPicker: () => void;
    handleShowGIFPicker: () => void;
    conversationId: string;
    stompClient: Client;
}) => {
    const dispatch = useDispatch();
    const accessToken = getAccessToken();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        if (!files.length) return;
        files.forEach(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
            );
            formData.append("public_id", file.name); // Set the name of the file
            formData.append("folder", `conversation/${conversationId}`); // Set the folder

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                    formData
                );
                const imageUrl = response.data.secure_url;
                if (imageUrl) {
                    const messageType = file.type.includes("image")
                        ? MESSAGE_TYPE.IMAGE
                        : file.type.includes("video")
                        ? MESSAGE_TYPE.VIDEO
                        : MESSAGE_TYPE.FILE;
                    const chatMessage = {
                        conversation_id: conversationId,
                        content: `${imageUrl};${file.name};${file.size}`,
                        type: messageType,
                    };
                    stompClient.send(
                        "/app/message",
                        {
                            Authorization: accessToken,
                        },
                        JSON.stringify(chatMessage)
                    );
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        });
    };
    return (
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
                <Box>
                    <IconButton
                        size="small"
                        color={isActive ? "info" : "inherit"}
                        aria-label="Đính kèm file"
                        className="btn-chat-action"
                        onClick={handleFileInputClick}
                    >
                        <PhotoLibraryIcon />
                    </IconButton>
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </Box>
            </Tooltip>
            <Tooltip title="Send sticker">
                <IconButton
                    size="small"
                    color={isActive ? "info" : "inherit"}
                    aria-label="Chọn nhãn dán"
                    className="btn-chat-action"
                    onClick={handleShowStickerPicker}
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
    );
};

export default ChatFeature;