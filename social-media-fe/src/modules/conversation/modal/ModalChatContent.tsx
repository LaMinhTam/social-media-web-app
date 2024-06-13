import React, { useEffect, useRef } from "react";
import ModalChatMessage from "./ModalChatMessage";
import { MessageResponse } from "@/types/conversationType";
import { handleGetListMessage } from "@/services/conversation.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import handleReverseMessages from "@/utils/conversation/messages/handleReverseMessages";
import { setCurrentPage } from "@/store/actions/conversationSlice";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { useSocket } from "@/contexts/socket-context";
import { groupMessages } from "@/utils/conversation/messages/handleGroupMessage";
import { v4 as uuidv4 } from "uuid";
const ModalChatContent = ({
    conversationId,
    messages,
    currentUserId,
    setMessages,
}: {
    conversationId: string;
    messages: MessageResponse;
    currentUserId: number;
    setMessages: (messages: MessageResponse) => void;
}) => {
    const { triggerScrollChat } = useSocket();
    const dispatch = useDispatch();
    const currentPage = useSelector(
        (state: RootState) => state.conversation.currentPage
    );
    const chatContentRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = React.useState(false);
    const [isEnd, setIsEnd] = React.useState(false);
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
                currentPage + 1,
                10
            );
            if (Object.values(data || {}).length > 0) {
                const newData = handleReverseMessages(data || {});
                const newMessages = { ...newData, ...messages };
                setMessages(newMessages);
                dispatch(setCurrentPage(currentPage + 1));
                setIsEnd(false);
            } else {
                setIsEnd(true);
                setLoading(false);
                return;
            }
            setLoading(false);
        }
    };
    return (
        <div
            ref={chatContentRef}
            className="flex-1 p-2 overflow-x-hidden overflow-y-auto custom-scrollbar"
            onScroll={() => !isEnd && handleScroll()}
        >
            {loading && <LoadingSpinner></LoadingSpinner>}
            {groupedMessages.map((group, index) => (
                <div key={uuidv4()}>
                    <div className="mt-2 text-xs text-center text-gray-500">
                        {group.formattedTime}
                    </div>
                    {group.data.map((message) => (
                        <ModalChatMessage
                            key={uuidv4()}
                            message={message}
                            type={
                                message.user_detail.user_id === currentUserId
                                    ? "send"
                                    : "receive"
                            }
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ModalChatContent;
