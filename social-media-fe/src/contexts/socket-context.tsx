import React, { useEffect, useOptimistic, useState } from "react";
import { Client, over } from "stompjs";
import SockJS from "sockjs-client";
import { SOCKET_URL } from "@/constants/global";
import SocketType from "@/types/socketType";
import { getAccessToken } from "@/utils/auth";
import { Member, MessageResponse } from "@/types/conversationType";
import getUserInfoFromCookie from "@/utils/auth/getUserInfoFromCookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import onMessageReceived from "@/utils/socket/onMessageReceived";
import {
    setNotifications,
    setTriggerReFetchingRelationship,
} from "@/store/actions/commonSlice";
import { toast } from "react-toastify";

const SocketContext = React.createContext<SocketType>({} as SocketType);

export function SocketProvider(
    props: JSX.IntrinsicAttributes & React.ProviderProps<SocketType>
) {
    const [messages, setMessages] = useState<MessageResponse>(
        {} as MessageResponse
    );
    const dispatch = useDispatch();
    const showChatModal = useSelector(
        (state: RootState) => state.common.showChatModal
    );
    const triggerReFetchingRelationship = useSelector(
        (state: RootState) => state.common.triggerReFetchingRelationship
    );
    const currentConversation = useSelector(
        (state: RootState) => state.conversation.currentConversation
    );
    const notifications = useSelector(
        (state: RootState) => state.common.notifications
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
                    async function (payload) {
                        const payloadData = JSON.parse(payload.body);
                        if (
                            payloadData.conversation_id ===
                            currentConversation.conversation_id
                        ) {
                            await onMessageReceived(
                                decryptedData as Member,
                                payload,
                                showChatModal,
                                currentConversation,
                                dispatch,
                                decryptedData.user_id,
                                setMessages,
                                setTriggerScrollChat,
                                triggerScrollChat
                            );
                        }
                    }
                );
                client.subscribe(
                    `/user/${decryptedData.user_id || ""}/revoke`,
                    function (payload) {
                        const payloadData = JSON.parse(payload.body);
                        setMessages((prev: MessageResponse) => ({
                            ...prev,
                            [payloadData.message_id]: {
                                ...payloadData,
                            },
                        }));
                    }
                );
                client.subscribe(
                    `/user/${decryptedData.user_id}/react`,
                    function (payload) {
                        const payloadData = JSON.parse(payload.body);
                        setMessages((prev: MessageResponse) => ({
                            ...prev,
                            [payloadData.message_id]: {
                                ...messages[payloadData.message_id],
                                reactions: payloadData.reactions,
                            },
                        }));
                    }
                );

                client.subscribe(
                    `/user/${decryptedData.user_id}/conversation`,
                    function (payload) {
                        const payloadData = JSON.parse(payload.body);
                        console.log("conversation", payloadData);
                    }
                );

                client.subscribe(
                    `/user/${decryptedData.user_id}/read`,
                    function (payload) {
                        console.log("read", JSON.parse(payload.body));
                        const payloadData = JSON.parse(payload.body);
                        const newMessages = { ...messages };
                        newMessages[payloadData.conversation_id] = {
                            ...messages[payloadData.conversation_id],
                            read_by: [
                                ...(messages[payloadData.conversation_id]
                                    ?.read_by || []),
                                payloadData.user_detail,
                            ],
                        };
                        setMessages(newMessages);
                        setTriggerScrollChat(!triggerScrollChat);
                    },
                    { Authorization: accessToken }
                );
                client.subscribe(
                    `/user/${decryptedData.user_id}/friend-status`,
                    function (payload) {
                        console.log("read", JSON.parse(payload.body));
                    }
                );
                client.subscribe(
                    `/user/${decryptedData.user_id}/friend-request`,
                    function (payload) {
                        console.log("read", JSON.parse(payload.body));
                        const payloadData = JSON.parse(payload.body);
                        dispatch(
                            setTriggerReFetchingRelationship(
                                !triggerReFetchingRelationship
                            )
                        );
                        switch (payloadData.type) {
                            case "ACCEPT":
                                const notification = {
                                    user: {
                                        friend_request_id:
                                            payloadData.friend_request_id,
                                        user_id: payloadData.user_id,
                                        name: payloadData.name,
                                        email: payloadData.email,
                                        image_url: payloadData.image_url,
                                    },
                                    message: "accepted your friend request",
                                };
                                dispatch(
                                    setNotifications([
                                        ...notifications,
                                        notification,
                                    ])
                                );
                                toast.info(
                                    `${payloadData.name} accepted your friend request!`
                                );
                                break;
                            case "SEND":
                                const notificationSend = {
                                    user: {
                                        friend_request_id:
                                            payloadData.friend_request_id,
                                        user_id: payloadData.user_id,
                                        name: payloadData.name,
                                        email: payloadData.email,
                                        image_url: payloadData.image_url,
                                    },
                                    message: "sent you a friend request",
                                };
                                dispatch(
                                    setNotifications([
                                        ...notifications,
                                        notificationSend,
                                    ])
                                );
                                toast.info(
                                    `${payloadData.name} sent you a friend request`
                                );
                                break;
                            case "REVOKE":
                                const notificationRevoke = {
                                    user: {
                                        friend_request_id:
                                            payloadData.friend_request_id,
                                        user_id: payloadData.user_id,
                                        name: payloadData.name,
                                        email: payloadData.email,
                                        image_url: payloadData.image_url,
                                    },
                                    message: "revoked friend request",
                                };
                                dispatch(
                                    setNotifications([
                                        ...notifications,
                                        notificationRevoke,
                                    ])
                                );
                                toast.info(
                                    `${payloadData.name} revoked friend request`
                                );
                                break;

                            default:
                                break;
                        }
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
                client.disconnect(() => {
                    console.log(
                        "Disconnected from the socket due to unmounting"
                    );
                });
            }
        };
    }, [currentConversation, triggerScrollChat]);

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
