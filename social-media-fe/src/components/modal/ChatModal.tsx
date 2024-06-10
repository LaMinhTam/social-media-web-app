import { IconButton, Typography } from "@mui/material";
import React from "react";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { setShowChatModal } from "@/store/actions/commonSlice";
import MicIcon from "@mui/icons-material/Mic";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import GifIcon from "@mui/icons-material/Gif";
import LabelIcon from "@mui/icons-material/Label";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SendIcon from "@mui/icons-material/Send";
import useClickOutSide from "@/hooks/useClickOutSide";
import { RootState } from "@/store/configureStore";
const ChatModal = () => {
    const dispatch = useDispatch();
    const {
        show: isActive,
        setShow: setIsActive,
        nodeRef: activeRef,
    } = useClickOutSide();
    const [showFullInput, setShowFullInput] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const userClicked = useSelector(
        (state: RootState) => state.user.userClicked
    );
    if (!userClicked) return null;
    return (
        <div className="w-[328px] h-[467px] rounded-lg">
            <div className="z-50 p-2 shadow-md">
                <div className="flex items-center justify-center">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center justify-center rounded-lg cursor-pointer w-11 h-11 hover:bg-strock">
                            {/* <img
                                src="https://source.unsplash.com/random"
                                alt=""
                                className="object-cover w-8 h-8 rounded-full"
                            /> */}
                            <div className="w-8 h-8 rounded-full bg-secondary"></div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="flex flex-col items-start justify-center">
                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                    className="flex-shrink-0 text-[15px]"
                                >
                                    {userClicked.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={"GrayText"}
                                    className="text-xs font-normal line-clamp-1"
                                >
                                    Hoạt động 1 giờ trước
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <IconButton size="small" color="inherit">
                            <CallIcon />
                        </IconButton>
                        <IconButton size="small" color="inherit">
                            <VideocamIcon />
                        </IconButton>
                        <IconButton size="small" color="inherit">
                            <RemoveIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => dispatch(setShowChatModal(false))}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
            </div>
            <div className="w-full h-[347px] overflow-x-hidden overflow-y-auto">
                <div>{message}</div>
            </div>
            <div className="z-50 w-full h-[60px] px-1 py-3 border-t shadow-md">
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
                    <div className="relative flex-1" ref={activeRef}>
                        <input
                            type="text"
                            placeholder="Aa"
                            className="py-1 px-2 w-full min-w-[136px] h-[36px] 
                            rounded-full bg-strock text-[15px]"
                            onChange={(e) => {
                                if (e.target.value === "") {
                                    setShowFullInput(false);
                                } else {
                                    setShowFullInput(true);
                                    setMessage(e.target.value);
                                }
                            }}
                            onFocus={() => setIsActive(true)}
                        />
                        <IconButton
                            size="small"
                            color={isActive ? "info" : "inherit"}
                            className="absolute right-0 transform -translate-y-1/2 top-1/2 btn-chat-action"
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
                            onClick={() => setMessage("")}
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
        </div>
    );
};

export default ChatModal;
