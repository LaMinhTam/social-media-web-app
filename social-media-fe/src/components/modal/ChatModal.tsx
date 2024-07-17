import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useClickOutSide from "@/hooks/useClickOutSide";
import { RootState } from "@/store/configureStore";
import ModalChatHeader from "@/modules/conversation/modal/ModalChatHeader";
import ModalChatFooter from "@/modules/conversation/modal/ModalChatFooter";
import ModalChatContent from "@/modules/conversation/modal/ModalChatContent";
import { handleGetUserStatus } from "@/services/conversation.service";
import { OnlineResponse, OnlineStatus } from "@/types/commonType";
import { useSocket } from "@/contexts/socket-context";

const ChatModal = () => {
    const dispatch = useDispatch();
    const {
        show: isActive,
        setShow: setIsActive,
        nodeRef: activeRef,
    } = useClickOutSide();
    const [showFullInput, setShowFullInput] = React.useState(false);
    const [userStatus, setUserStatus] = React.useState<OnlineStatus>(
        {} as OnlineStatus
    );
    const currentConversation = useSelector(
        (state: RootState) => state.conversation.currentConversation
    );
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );

    const anotherUser =
        currentConversation?.members[
            Object.keys(currentConversation.members).find(
                (key) =>
                    currentConversation.members[key].user_id !==
                    currentUserProfile.user_id
            ) as string
        ];

    const { messages, stompClient, setMessages } = useSocket();

    useEffect(() => {
        async function getStatus() {
            if (anotherUser) {
                const data = await handleGetUserStatus(
                    anotherUser.user_id.toString()
                );
                if (data) {
                    setUserStatus(data[anotherUser.user_id.toString()]);
                }
            }
        }
        getStatus();
    }, []);

    if (!currentConversation || !stompClient) {
        return null;
    }
    return (
        <div className="w-[382px] h-[467px] rounded-lg flex flex-col bg-lite">
            <ModalChatHeader
                userId={anotherUser?.user_id}
                isGroup={currentConversation.type === "GROUP" ? true : false}
                userStatus={userStatus}
                username={currentConversation.name}
                dispatch={dispatch}
                avatar={currentConversation.image}
                isAdmin={
                    currentConversation.owner_id === currentUserProfile.user_id
                }
                targetUser={anotherUser}
            ></ModalChatHeader>
            <ModalChatContent
                isGroup={currentConversation.type === "GROUP" ? true : false}
                conversationId={currentConversation.conversation_id}
                messages={messages}
                currentUserId={currentUserProfile.user_id}
                setMessages={setMessages}
            ></ModalChatContent>
            <ModalChatFooter
                isAdmin={
                    currentConversation.owner_id === currentUserProfile.user_id
                }
                isActive={isActive}
                setIsActive={setIsActive}
                showFullInput={showFullInput}
                setShowFullInput={setShowFullInput}
                activeRef={activeRef}
                stompClient={stompClient}
                conversationId={currentConversation.conversation_id}
            ></ModalChatFooter>
        </div>
    );
};

export default ChatModal;
