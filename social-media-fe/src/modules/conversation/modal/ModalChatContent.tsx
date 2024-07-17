import React, { useEffect, useLayoutEffect, useRef } from "react";
import ModalChatMessage from "./messsage/ModalChatMessage";
import { MessageResponse } from "@/types/conversationType";
import { handleGetListMessage } from "@/services/conversation.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import handleReverseMessages from "@/utils/conversation/messages/handleReverseMessages";
import { setCurrentSize } from "@/store/actions/conversationSlice";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { useSocket } from "@/contexts/socket-context";
import { groupMessages } from "@/utils/conversation/messages/handleGroupMessage";
import { v4 as uuidv4 } from "uuid";
import handleFormatNotificationMessage from "@/utils/conversation/messages/handleFormatNotificationMessage";
import Image from "next/image";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import { DEFAULT_AVATAR } from "@/constants/global";
const ModalChatContent = ({
    conversationId,
    messages,
    currentUserId,
    setMessages,
    isGroup,
}: {
    conversationId: string;
    messages: MessageResponse;
    currentUserId: number;
    setMessages: (messages: MessageResponse) => void;
    isGroup: boolean;
}) => {
    const { triggerScrollChat, messageRefs, setMessageRefs } = useSocket();
    const dispatch = useDispatch();
    const currentSize = useSelector(
        (state: RootState) => state.conversation.currentSize
    );
    const currentConversation = useSelector(
        (state: RootState) => state.conversation.currentConversation
    );
    const chatContentRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<MutationObserver | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [isEnd, setIsEnd] = React.useState(false);
    const [autoScroll, setAutoScroll] = React.useState(true);
    const groupedMessages = groupMessages(Object.values(messages));
    const progress = useSelector((state: RootState) => state.common.progress);
    const handleScroll = async () => {
        if (chatContentRef.current?.scrollTop === 0) {
            setLoading(true);
            const data = await handleGetListMessage(
                conversationId,
                currentSize + 10
            );
            if (
                Object.values(data || {}).length !==
                Object.values(messages).length
            ) {
                const newData = handleReverseMessages(data || {});
                const newMessages = { ...newData, ...messages };
                setMessages(newMessages);
                dispatch(setCurrentSize(currentSize + 10));
                setIsEnd(false);
            } else {
                setIsEnd(true);
                setLoading(false);
                return;
            }
            setLoading(false);
        }
        if (chatContentRef.current) {
            if (
                chatContentRef.current.scrollTop <
                chatContentRef.current.scrollHeight -
                    chatContentRef.current.clientHeight
            ) {
                setAutoScroll(false);
            } else {
                setAutoScroll(true);
            }
        }
    };
    useEffect(() => {
        groupedMessages.forEach((group) => {
            group?.data.forEach((msg) => {
                if (!messageRefs[msg.message_id]) {
                    setMessageRefs((refs: any) => ({
                        ...refs,
                        [msg.message_id]: React.createRef(),
                    }));
                }
            });
        });
    }, [groupedMessages, messageRefs, setMessageRefs]);
    useEffect(() => {
        if (chatContentRef.current) {
            const observer = new MutationObserver(() => {
                if (autoScroll) {
                    chatContentRef.current!.scrollTop =
                        chatContentRef.current!.scrollHeight;
                }
            });

            observer.observe(chatContentRef.current, {
                childList: true,
                subtree: true,
            });

            observerRef.current = observer;

            return () => {
                if (observerRef.current) {
                    observerRef.current.disconnect();
                }
            };
        }
    }, [groupedMessages, autoScroll, triggerScrollChat]);
    return (
        <div
            ref={chatContentRef}
            className="flex-1 p-2 overflow-x-hidden overflow-y-auto custom-scrollbar"
            id="chat-content"
            onScroll={() => !isEnd && handleScroll()}
        >
            {loading && <LoadingSpinner></LoadingSpinner>}
            {groupedMessages.map((group, index) => {
                const lastGroup = groupedMessages.length - 1 === index;
                const lastMessageOfGroup = group.data[group.data.length - 1];
                return (
                    <div key={uuidv4()}>
                        <div className="mt-2 text-xs text-center text-gray-500">
                            {group.formattedTime}
                        </div>
                        {group.data.map((message, index) => {
                            return (
                                <div
                                    className="relative"
                                    ref={messageRefs[message.message_id]}
                                    key={uuidv4()}
                                >
                                    {message.type !== "NOTIFICATION" ? (
                                        <ModalChatMessage
                                            message={message}
                                            type={
                                                message.user_detail.user_id ===
                                                currentUserId
                                                    ? "send"
                                                    : "receive"
                                            }
                                            isGroup={isGroup}
                                        />
                                    ) : (
                                        <div className="my-2 text-sm text-center text-text8">
                                            {handleFormatNotificationMessage(
                                                message,
                                                currentUserId,
                                                currentConversation.settings
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {progress > 0 && (
                            <div className="flex items-center justify-center">
                                <CircularProgress
                                    variant="determinate"
                                    value={progress}
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-end gap-x-2">
                            {lastGroup &&
                                lastMessageOfGroup.read_by &&
                                lastMessageOfGroup.read_by.length > 0 &&
                                lastMessageOfGroup.read_by.map((member) => {
                                    if (
                                        member.user_id === currentUserId ||
                                        currentUserId !==
                                            lastMessageOfGroup.user_detail
                                                .user_id
                                    )
                                        return null;
                                    return (
                                        <Tooltip
                                            key={member.user_id}
                                            title={member.name}
                                        >
                                            <Box className="flex items-center justify-end mt-2 cursor-pointer">
                                                <Image
                                                    src={
                                                        member.image_url ??
                                                        DEFAULT_AVATAR
                                                    }
                                                    width={16}
                                                    height={16}
                                                    alt="avatar"
                                                    className="w-4 h-4 rounded-full"
                                                />
                                            </Box>
                                        </Tooltip>
                                    );
                                })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ModalChatContent;
