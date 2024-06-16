import React, { useEffect, useOptimistic, useState } from "react";
import { Client, over } from "stompjs";
import SockJS from "sockjs-client";
import { SOCKET_URL } from "@/constants/global";
import SocketType from "@/types/socketType";
import { getAccessToken } from "@/utils/auth";
import { MessageResponse } from "@/types/conversationType";
import getUserInfoFromCookie from "@/utils/auth/getUserInfoFromCookie";

const SocketContext = React.createContext<SocketType>({} as SocketType);

export function SocketProvider(
    props: JSX.IntrinsicAttributes & React.ProviderProps<SocketType>
) {
    const [messages, setMessages] = useState<MessageResponse>(
        {} as MessageResponse
    );
    const [triggerScrollChat, setTriggerScrollChat] = useState<boolean>(false);
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
                    (payload) => {
                        const payloadData = JSON.parse(payload.body);
                        setMessages((prev) => ({
                            ...prev,
                            [payloadData.message_id]: {
                                message_id: payloadData.message_id,
                                conversation_id: payloadData.conversation_id,
                                user_detail: payloadData.user_detail,
                                content: payloadData.content,
                                type: payloadData.type,
                                created_at: payloadData.created_at,
                                updated_at: payloadData.updated_at,
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
                        setTriggerScrollChat(!triggerScrollChat);
                    }
                );
                client.subscribe(
                    `/user/${decryptedData.user_id}/react`,
                    function (payload) {
                        const payloadData = JSON.parse(payload.body);
                        const newMessages = { ...messages };
                        newMessages[payloadData.message_id] = payloadData;
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
    }, []);

    const contextValues = {
        messages,
        setMessages,
        stompClient,
        setStompClient,
        optimisticMessages,
        addOptimisticUpdate,
        triggerScrollChat,
        setTriggerScrollChat,
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
