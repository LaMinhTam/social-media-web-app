import {
    setOpenCallDialog,
    setShowChatModal,
} from "@/store/actions/commonSlice";
import { IconButton, Popover, Typography } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { OnlineStatus } from "@/types/commonType";
import Image from "next/image";
import { setCurrentConversation } from "@/store/actions/conversationSlice";
import { ConversationResponse } from "@/types/conversationType";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import GroupSetting from "./group/GroupSetting";
import VideoCallDialog from "./call/VideoCallDialog";
import { formatOnlineTime } from "@/utils/conversation/messages/handleGroupMessage";
import { useCall } from "@/contexts/call-context";
import { useDispatch } from "react-redux";

const ModalChatHeader = ({
    userId,
    username,
    dispatch,
    userStatus,
    avatar,
    isAdmin,
    isGroup,
}: {
    userId: number;
    username: string;
    dispatch: Dispatch<any>;
    userStatus: OnlineStatus;
    avatar: string;
    isAdmin: boolean;
    isGroup: boolean;
}) => {
    const { setTargetUserId } = useCall();
    return (
        <>
            <div className="z-50 flex-shrink-0 p-2 shadow-md">
                <div className="flex items-center justify-between">
                    <PopupState variant="popover" popupId="group-popup-popover">
                        {(popupState) => (
                            <div>
                                <div
                                    className="flex items-center cursor-pointer gap-x-2 hover:bg-strock"
                                    {...bindTrigger(popupState)}
                                >
                                    <div className="flex items-center justify-center rounded-lg w-11 h-11">
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
                                                ? "Online"
                                                : userStatus?.timestamp !== 0
                                                ? `Online ${formatOnlineTime(
                                                      userStatus.timestamp
                                                  )} ago`
                                                : "Just now"}
                                        </Typography>
                                    </div>
                                </div>
                                <Popover
                                    {...bindPopover(popupState)}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    {isGroup && (
                                        <GroupSetting
                                            isAdmin={isAdmin}
                                            popupState={popupState}
                                        ></GroupSetting>
                                    )}
                                </Popover>
                            </div>
                        )}
                    </PopupState>
                    <div className="flex items-center gap-x-1">
                        <IconButton size="small" color="inherit">
                            <CallIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => {
                                setTargetUserId(userId);
                                dispatch(setOpenCallDialog(true));
                                // register(userId);
                            }}
                        >
                            <VideocamIcon />
                        </IconButton>
                        <IconButton size="small" color="inherit">
                            <RemoveIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => {
                                dispatch(
                                    setCurrentConversation(
                                        {} as ConversationResponse
                                    )
                                );
                                dispatch(setShowChatModal(false));
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalChatHeader;
