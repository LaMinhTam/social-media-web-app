import React, { useEffect, useRef } from "react";
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
    const [loading, setLoading] = React.useState(false);
    const [isEnd, setIsEnd] = React.useState(false);
    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop =
                chatContentRef.current.scrollHeight;
        }
    }, []);
    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop =
                chatContentRef.current.scrollHeight;
        }
    }, [triggerScrollChat]);
    const groupedMessages = groupMessages(Object.values(messages));
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
    return (
        <div
            ref={chatContentRef}
            className="flex-1 p-2 overflow-x-hidden overflow-y-auto custom-scrollbar"
            id="chat-content"
            onScroll={() => !isEnd && handleScroll()}
        >
            {loading && <LoadingSpinner></LoadingSpinner>}
            {groupedMessages.map((group, index) => (
                <div key={uuidv4()}>
                    <div className="mt-2 text-xs text-center text-gray-500">
                        {group.formattedTime}
                    </div>
                    {group.data.map((message) => (
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
                                    isLastMessage={
                                        group.data.indexOf(message) ===
                                        group.data.length - 1
                                    }
                                />
                            ) : (
                                <div className="my-2 text-sm text-center text-text8">
                                    {handleFormatNotificationMessage(
                                        message,
                                        currentUserId
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ModalChatContent;
