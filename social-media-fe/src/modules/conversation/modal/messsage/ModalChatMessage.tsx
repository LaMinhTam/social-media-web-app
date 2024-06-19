import MessageFeature from "@/modules/conversation/modal/messsage/MessageFeature";
import MessageFeatureDialog from "@/modules/conversation/modal/messsage/MessageFeatureDialog";
import useClickOutSide from "@/hooks/useClickOutSide";
import useHover from "@/hooks/useHover";
import {
    handleDeleteMessage,
    handleReactionMessage,
    handleRevokeMessage,
} from "@/services/conversation.service";
import {
    setIsReplying,
    setMessageReply,
} from "@/store/actions/conversationSlice";
import { MessageData } from "@/types/conversationType";
import formatTime from "@/utils/conversation/messages/handleGroupMessage";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import RevokeMessageDialog from "./RevokeMessageDialog";
import RemoveMessageDialog from "./RemoveMessageDialog";
import { MESSAGE_TYPE } from "@/constants/global";
import ReactionPicker from "@/components/common/ReactionPicker";
import { RootState } from "@/store/configureStore";
import ForwardMessageDialog from "./ForwardMessageDialog";
import MessageText from "./MessageText";
import MessageMultimedia from "./MessageMultimedia";
import { useSocket } from "@/contexts/socket-context";
const ModalChatMessage = ({
    type,
    message,
    isGroup,
}: {
    type: string;
    message: MessageData;
    isGroup: boolean;
}) => {
    const { messages, setMessages } = useSocket();
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
            setOpenDeleteDialog(false);
        }
    };
    const onRemoveMessage = async () => {
        const response = await handleDeleteMessage(message.message_id);
        const newMessages = { ...messages };
        delete newMessages[message.message_id];
        setMessages(newMessages);
        setOpenDeleteDialog(false);
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
        <>
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
                {[
                    MESSAGE_TYPE.GIF,
                    MESSAGE_TYPE.STICKER,
                    MESSAGE_TYPE.EMOJI,
                    MESSAGE_TYPE.FILE,
                    MESSAGE_TYPE.IMAGE,
                    MESSAGE_TYPE.VIDEO,
                    MESSAGE_TYPE.VOICE,
                ].includes(message.type) ? (
                    <MessageMultimedia
                        isGroup={isGroup}
                        type={type}
                        message={message}
                    ></MessageMultimedia>
                ) : (
                    <MessageText
                        type={type}
                        message={message}
                        isGroup={isGroup}
                    ></MessageText>
                )}
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
                        onRemoveMessage={onRemoveMessage}
                    />
                ) : (
                    <RemoveMessageDialog
                        openDeleteDialog={openDeleteDialog}
                        setOpenDeleteDialog={setOpenDeleteDialog}
                        onRemoveMessage={onRemoveMessage}
                    />
                ))}
            {openForwardDialog && (
                <ForwardMessageDialog
                    openForwardDialog={openForwardDialog}
                    setOpenForwardDialog={setOpenForwardDialog}
                    onForwardMessage={() => {}}
                />
            )}
        </>
    );
};

export default ModalChatMessage;
