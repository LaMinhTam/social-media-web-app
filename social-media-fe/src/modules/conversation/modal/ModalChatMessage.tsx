import MessageFeature from "@/components/common/MessageFeature";
import MessageFeatureDialog from "@/components/common/MessageFeatureDialog";
import useClickOutSide from "@/hooks/useClickOutSide";
import useHover from "@/hooks/useHover";
import {
    setIsReplying,
    setMessageReply,
} from "@/store/actions/conversationSlice";
import { MessageData } from "@/types/conversationType";
import formatTime from "@/utils/conversation/messages/handleGroupMessage";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useDispatch } from "react-redux";

const ModalChatMessage = ({
    type,
    message,
}: {
    type: string;
    message: MessageData;
}) => {
    const dispatch = useDispatch();
    const [hoverRef, isHovered] = useHover();
    const {
        show: showFeature,
        setShow: setShowFeature,
        nodeRef: featureRef,
    } = useClickOutSide();
    const handleReplyMessage = () => {
        dispatch(setMessageReply(message));
        dispatch(setIsReplying(true));
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
                <Tooltip title={formatTime(message.created_at)}>
                    <div
                        className={`rounded-lg w-fit max-w-[212px] px-3 py-2 my-2 ${
                            type === "send"
                                ? "bg-secondary text-lite ml-auto"
                                : "bg-strock text-text1 mr-auto"
                        }`}
                        style={{
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                        }}
                    >
                        <p className="text-wrap">{message.content}</p>
                    </div>
                </Tooltip>
                {isHovered && (
                    <div
                        className={`absolute p-2 transform -translate-y-1/2 bg-lite top-1/2 ${
                            type === "send" ? "left-0" : "right-0"
                        }`}
                    >
                        <div className="w-[89px] h-full">
                            <MessageFeature
                                messageId={message.message_id}
                                setIsOpen={setShowFeature}
                                handleReplyMessage={handleReplyMessage}
                            ></MessageFeature>
                        </div>
                    </div>
                )}
                {showFeature && (
                    <div
                        ref={featureRef}
                        className={`absolute -translate-y-[30px] top-[-30px] rounded-lg shadow-md bg-lite ${
                            type === "send" ? "left-0" : "right-0"
                        }`}
                    >
                        <MessageFeatureDialog />
                    </div>
                )}
            </div>
        </>
    );
};

export default ModalChatMessage;
