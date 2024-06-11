import { setShowChatModal } from "@/store/actions/commonSlice";
import { IconButton, Typography } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { OnlineStatus } from "@/types/commonType";
import Image from "next/image";

const ModalChatHeader = ({
    username,
    dispatch,
    userStatus,
    avatar,
}: {
    username: string;
    dispatch: Dispatch<any>;
    userStatus: OnlineStatus;
    avatar: string;
}) => {
    return (
        <div className="z-50 flex-shrink-0 p-2 shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center justify-center rounded-lg cursor-pointer w-11 h-11 hover:bg-strock">
                        <div className="w-8 h-8 rounded-full">
                            <Image
                                src={avatar}
                                alt="avatar"
                                width={32}
                                height={32}
                                className="w-full h-full rounded-full"
                            ></Image>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-center">
                        <Typography
                            variant="body1"
                            fontWeight={600}
                            className="flex-shrink-0 text-[15px]"
                        >
                            {username}
                        </Typography>
                        <Typography
                            variant="body2"
                            color={"GrayText"}
                            className="text-xs font-normal line-clamp-1"
                        >
                            {userStatus?.online === "ONLINE"
                                ? "Đang hoạt động"
                                : userStatus?.timestamp !== 0
                                ? `Hoạt động ${userStatus?.timestamp} phút trước`
                                : "Vừa truy cập"}
                        </Typography>
                    </div>
                </div>
                <div className="flex items-center gap-x-1">
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
    );
};

export default ModalChatHeader;
