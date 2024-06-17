import { IconButton, Tooltip } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import GifIcon from "@mui/icons-material/Gif";
import LabelIcon from "@mui/icons-material/Label";
import React from "react";

const ChatFeature = ({
    isActive,
    handleShowStickerPicker,
    handleShowGIFPicker,
}: {
    isActive: boolean;
    handleShowStickerPicker: () => void;
    handleShowGIFPicker: () => void;
}) => {
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
