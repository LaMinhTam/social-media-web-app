import MessageFeature from "@/components/common/MessageFeature";
import MessageFeatureDialog from "@/components/common/MessageFeatureDialog";
import useClickOutSide from "@/hooks/useClickOutSide";
import useHover from "@/hooks/useHover";
import {
    handleReactionMessage,
    handleRevokeMessage,
} from "@/services/conversation.service";
import {
    setIsReplying,
    setMessageReply,
} from "@/store/actions/conversationSlice";
import { MessageData } from "@/types/conversationType";
import handleFormatMessage from "@/utils/conversation/messages/handleFormatMessage";
import formatTime from "@/utils/conversation/messages/handleGroupMessage";
import { Button, IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import RevokeMessageDialog from "./RevokeMessageDialog";
import RemoveMessageDialog from "./RemoveMessageDialog";
import { MESSAGE_TYPE } from "@/constants/global";
import ReactionPicker from "@/components/common/ReactionPicker";
import { RootState } from "@/store/configureStore";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";
import ForwardMessageDialog from "./ForwardMessageDialog";
const ModalChatMessage = ({
    type,
    message,
}: {
    type: string;
    message: MessageData;
}) => {
    const dispatch = useDispatch();
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const [hoverRef, isHovered] = useHover();
    const {
        show: showFeature,
        setShow: setShowFeature,
        nodeRef: featureRef,
    } = useClickOutSide();
    const {
        show: openReactionPicker,
        setShow: setOpenReactionPicker,
        nodeRef: reactionRef,
    } = useClickOutSide();
    const handleReplyMessage = () => {
        dispatch(setMessageReply(message));
        dispatch(setIsReplying(true));
    };
    const onRevokeMessage = async () => {
        const response = await handleRevokeMessage(message.message_id);
        if (response) {
            console.log("Revoke message success");
        }
    };
    const onRemoveMessage = async () => {
        console.log("Remove message");
    };
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openForwardDialog, setOpenForwardDialog] = React.useState(false);
    const handleReactionClick = async (reaction: {
        name: string;
        emoji: string;
    }) => {
        const response = await handleReactionMessage(
            message.message_id,
            reaction.name
        );
        if (response && response.message_id) {
            console.log("Reaction success");
        }
    };
    return (
        <div className="relative">
            <div
                className="relative flex items-center justify-center gap-x-1"
                ref={hoverRef}
            >
                <div className="flex items-center">
                    {type === "receive" && (
                        <Image
                            src={
                                message.user_detail.image_url ??
                                "https://source.unsplash.com/random"
                            }
                            width={32}
                            height={32}
                            alt="avatar"
                            className="w-8 h-8 rounded-full"
                        />
                    )}
                </div>
                <Tooltip title={formatTime(message.created_at)}>
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
                        <p className="text-wrap">
                            {handleFormatMessage(message)}
                        </p>
                        {message.type !== MESSAGE_TYPE.REVOKED &&
                            Object.keys(message.reactions ?? {}).length > 0 && (
                                <div className="flex items-center gap-x-1">
                                    {Object.keys(message.reactions ?? {}).map(
                                        (reaction) => (
                                            <Button
                                                className={`absolute bottom-[-20px] right-[-15px]`}
                                            >
                                                {handleRenderReactionMessage(
                                                    reaction
                                                )}
                                            </Button>
                                        )
                                    )}
                                </div>
                            )}
                    </div>
                </Tooltip>
                {isHovered && message.type !== MESSAGE_TYPE.REVOKED && (
                    <div
                        className={`absolute p-2 transform -translate-y-1/2 bg-lite top-1/2 z-40 ${
                            type === "send" ? "left-0" : "right-0"
                        }`}
                    >
                        <div className="w-[89px] h-full">
                            <MessageFeature
                                messageId={message.message_id}
                                setIsOpen={setShowFeature}
                                handleReplyMessage={handleReplyMessage}
                                openReactionPicker={openReactionPicker}
                                setOpenReactionPicker={setOpenReactionPicker}
                            ></MessageFeature>
                        </div>
                    </div>
                )}
                {showFeature && (
                    <div
                        ref={featureRef}
                        className={`absolute -translate-y-[30px] top-[-30px] rounded-lg shadow-md bg-lite z-50 ${
                            type === "send" ? "left-0" : "right-0"
                        }`}
                    >
                        <MessageFeatureDialog
                            setOpenDeleteDialog={setOpenDeleteDialog}
                            setOpenForwardDialog={setOpenForwardDialog}
                        />
                    </div>
                )}
            </div>
            {openReactionPicker && (
                <div
                    ref={reactionRef}
                    className={`absolute -translate-y-0 top-0 z-50 ${
                        type === "send" ? "left-0" : "right-0"
                    }`}
                >
                    <ReactionPicker
                        handleReactionClick={handleReactionClick}
                    ></ReactionPicker>
                </div>
            )}
            {openDeleteDialog &&
                (type === "send" ? (
                    <RevokeMessageDialog
                        openDeleteDialog={openDeleteDialog}
                        setOpenDeleteDialog={setOpenDeleteDialog}
                        onRevokeMessage={onRevokeMessage}
                        onRemoveMessage={onRevokeMessage}
                    />
                ) : (
                    <RemoveMessageDialog
                        openDeleteDialog={openDeleteDialog}
                        setOpenDeleteDialog={setOpenDeleteDialog}
                        onRemoveMessage={onRevokeMessage}
                    />
                ))}
            {openForwardDialog && (
                <ForwardMessageDialog
                    openForwardDialog={openForwardDialog}
                    setOpenForwardDialog={setOpenForwardDialog}
                    onForwardMessage={() => {}}
                />
            )}
        </div>
    );
};

export default ModalChatMessage;
