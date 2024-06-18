import React, { useEffect, useOptimistic, useState } from "react";
import { Client, over } from "stompjs";
import SockJS from "sockjs-client";
import { SOCKET_URL } from "@/constants/global";
import SocketType from "@/types/socketType";
import { getAccessToken } from "@/utils/auth";
import { MessageResponse } from "@/types/conversationType";
import getUserInfoFromCookie from "@/utils/auth/getUserInfoFromCookie";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/constants/firebaseConfig";
import handleUpdateUnreadMessage from "@/utils/conversation/messages/handleUpdateUnreadMessage";
import handleSaveUnreadMessage from "@/utils/conversation/messages/handleSaveUnreadMessage";

const SocketContext = React.createContext<SocketType>({} as SocketType);

export function SocketProvider(
    props: JSX.IntrinsicAttributes & React.ProviderProps<SocketType>
) {
    const [messages, setMessages] = useState<MessageResponse>(
        {} as MessageResponse
    );
    const showChatModal = useSelector(
        (state: RootState) => state.common.showChatModal
    );
    const currentConversation = useSelector(
        (state: RootState) => state.conversation.currentConversation
    );
    const [triggerScrollChat, setTriggerScrollChat] = useState<boolean>(false);
    const [messageRefs, setMessageRefs] = useState<any>({});
    const [optimisticMessages, addOptimisticUpdate] =
        useOptimistic<MessageResponse>(messages);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const accessToken = getAccessToken();
    const decryptedData = getUserInfoFromCookie();

    useEffect(() => {
        const sock = new SockJS(SOCKET_URL);
        const client = over(sock);
        client.connect(
            {
                Authorization: accessToken,
            },
            () => {
                console.log("connection open");

                client.subscribe(
                    `/user/${decryptedData.user_id || ""}/message`,
                    async (payload) => {
                        const payloadData = JSON.parse(payload.body);
                        const isSavedUnreadMessage =
                            !showChatModal ||
                            currentConversation.conversation_id !==
                                payloadData.conversation_id;
                        if (isSavedUnreadMessage) {
                            console.log("unread message");
                            const docRef = doc(
                                collection(db, "unreadTrack"),
                                payloadData.conversation_id
                            );
                            const docSnap = await getDoc(docRef);
                            if (docSnap.exists()) {
                                handleUpdateUnreadMessage(
                                    payloadData.conversation_id,
                                    decryptedData.user_id,
                                    payloadData.message_id
                                );
                            } else {
                                handleSaveUnreadMessage(
                                    payloadData.conversation_id,
                                    {
                                        [decryptedData.user_id]: [
                                            {
                                                user_id: decryptedData.user_id,
                                                message_id:
                                                    payloadData.message_id,
                                            },
                                        ],
                                    }
                                );
                            }
                        }
                        setMessages((prev) => ({
                            ...prev,
                            [payloadData.message_id]: {
                                ...payloadData,
                            },
                        }));
                        setTriggerScrollChat(!triggerScrollChat);
                    }
                );
                client.subscribe(
                    `/user/${decryptedData.user_id || ""}/revoke`,
                    function (payload) {
                        const payloadData = JSON.parse(payload.body);
                        const newMessages = { ...messages };
                        newMessages[payloadData.message_id] = payloadData;
                        setMessages(newMessages);
                    }
                );
                client.subscribe(
                    `/user/${decryptedData.user_id}/react`,
                    function (payload) {
                        const payloadData = JSON.parse(payload.body);
                        const newMessages = { ...messages };
                        newMessages[payloadData.message_id] = {
                            ...messages[payloadData.message_id],
                            reactions: payloadData.reactions,
                        };
                        setMessages(newMessages);
                    }
                );

                client.subscribe(
                    `/user/${decryptedData.user_id}/conversation`,
                    function (payload) {
                        console.log("conversation", JSON.parse(payload.body));
                    }
                );
            },
            (error) => {
                console.log("connection error", error);
            }
        );

        setStompClient(client);
        console.log("client", client);
        // Clean up
        return () => {
            if (client && client.connected) {
                client.disconnect(() => {});
            }
        };
    }, [currentConversation]);

    const contextValues = {
        messages,
        setMessages,
        stompClient,
        setStompClient,
        optimisticMessages,
        addOptimisticUpdate,
        triggerScrollChat,
        setTriggerScrollChat,
        messageRefs,
        setMessageRefs,
    };

    return (
        <SocketContext.Provider
            {...props}
            value={contextValues}
        ></SocketContext.Provider>
    );
}

export function useSocket() {
    const context = React.useContext(SocketContext);
    if (typeof context === "undefined")
        throw new Error("useSocket must be used within SocketProvider");
    return context;
}
