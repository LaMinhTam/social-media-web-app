import {
    setOpenCallDialog,
    setOpenGroupCallDialog,
    setShowChatModal,
} from "@/store/actions/commonSlice";
import { Button, IconButton, Popover, Typography } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { OnlineStatus } from "@/types/commonType";
import Image from "next/image";
import { setCurrentConversation } from "@/store/actions/conversationSlice";
import { ConversationResponse, Member } from "@/types/conversationType";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import GroupSetting from "./group/GroupSetting";
import { formatOnlineTime } from "@/utils/conversation/messages/handleGroupMessage";
import { useCall } from "@/contexts/call-context";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import GroupCallDialog from "./call/GroupCallDialog";
import { useRouter } from "next/navigation";

const ModalChatHeader = ({
    userId,
    username,
    dispatch,
    userStatus,
    avatar,
    isAdmin,
    isGroup,
    targetUser,
}: {
    userId: number;
    username: string;
    dispatch: Dispatch<any>;
    userStatus: OnlineStatus;
    avatar: string;
    isAdmin: boolean;
    isGroup: boolean;
    targetUser: Member;
}) => {
    const router = useRouter();
    const { setTargetUserId, setTargetUser } = useCall();
    const openGroupCallDialog = useSelector(
        (state: RootState) => state.common.openGroupCallDialog
    );
    const currentConversation = useSelector(
        (state: RootState) => state.conversation.currentConversation
    );
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );

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
                                    {isGroup ? (
                                        <GroupSetting
                                            isAdmin={isAdmin}
                                            popupState={popupState}
                                        ></GroupSetting>
                                    ) : (
                                        <Button
                                            variant="text"
                                            size="medium"
                                            className="px-4 py-2 normal-case"
                                            onClick={() => {
                                                dispatch(
                                                    setShowChatModal(false)
                                                );
                                                router.push(`/user/${userId}`);
                                            }}
                                        >
                                            View profile
                                        </Button>
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
                                if (isGroup) {
                                    dispatch(setOpenGroupCallDialog(true));
                                } else {
                                    setTargetUserId(userId);
                                    dispatch(setOpenCallDialog(true));
                                    setTargetUser(targetUser);
                                }
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

            {openGroupCallDialog && (
                <GroupCallDialog
                    name={currentUserProfile.name || "Unknown"}
                    conversation={currentConversation}
                    openGroupCallDialog={openGroupCallDialog}
                    dispatch={dispatch}
                ></GroupCallDialog>
            )}
        </>
    );
};

export default ModalChatHeader;
