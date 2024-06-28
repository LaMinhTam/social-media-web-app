import { CALL_STATE, CALL_WS_URL, REGISTER_STATE } from "@/constants/global";
import { setOpenCallDialog } from "@/store/actions/commonSlice";
import { RootState } from "@/store/configureStore";
import CallType from "@/types/callType";
import getUserInfoFromCookie from "@/utils/auth/getUserInfoFromCookie";
import { WebRtcPeer } from "kurento-utils";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const CallContext = React.createContext<CallType>({} as CallType);

export function CallProvider(
    props: JSX.IntrinsicAttributes & React.ProviderProps<CallType>
) {
    const openCallDialog = useSelector(
        (state: RootState) => state.common.openCallDialog
    );
    const dispatch = useDispatch();
    const decryptedData = getUserInfoFromCookie();
    const [isReady, setIsReady] = React.useState<boolean>(false);
    const [targetUserId, setTargetUserId] = React.useState<number>(-1);
    const [callState, setCallState] = React.useState<string>(
        CALL_STATE.NO_CALL
    );
    const [isIncomingCall, setIsIncomingCall] = React.useState<boolean>(false);
    const [inComingCallId, setInComingCallId] = React.useState<number>(-1);
    const [registerState, setRegisterState] = React.useState<number>(0);
    const [videoInput, setVideoInput] = React.useState<HTMLVideoElement | null>(
        null
    );
    const [videoOutput, setVideoOutput] =
        React.useState<HTMLVideoElement | null>(null);
    const [webRtcPeer, setWebRtcPeer] = React.useState<WebRtcPeer | null>(null);
    const [socket, setSocket] = React.useState<WebSocket | null>(null);
    useEffect(() => {
        const ws = new WebSocket(CALL_WS_URL);
        console.log("Attempting to open WebSocket connection...");
        ws.onopen = () => {
            console.log("WebSocket kurento connection opened");
            setIsReady(true);
        };

        ws.onclose = (event) => {
            console.log("WebSocket kurento connection closed: ", event);
        };

        ws.onerror = (error) => {
            console.log("WebSocket kurento error: ", error);
        };
        ws.onmessage = (message) => {
            const parsedMessage = JSON.parse(message.data);
            console.info("Received message: " + message.data);
            switch (parsedMessage.id) {
                case "registerResponse":
                    console.log("Register response received");
                    registerResponse(parsedMessage);
                    break;
                case "callResponse":
                    console.log("Call response received");
                    callResponse(parsedMessage);
                    break;
                case "incomingCall":
                    console.log("Incoming call received");
                    incomingCall(parsedMessage);
                    break;
                case "startCommunication":
                    console.log("Communication started");
                    startCommunication(parsedMessage);
                    break;
                case "stopCommunication":
                    console.info("Communication ended by remote peer");
                    stop(true);
                    break;
                case "iceCandidate":
                    webRtcPeer?.addIceCandidate(
                        parsedMessage.candidate,
                        function (error) {
                            if (error)
                                return console.error(
                                    "Error adding candidate: " + error
                                );
                        }
                    );
                    break;
                default:
                    console.error("Unrecognized message", parsedMessage);
            }
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        if (isReady && decryptedData) {
            register(decryptedData.user_id);
        }
    }, [isReady]);

    useEffect(() => {
        if (
            openCallDialog &&
            videoInput &&
            videoOutput &&
            callState === CALL_STATE.PROCESSING_CALL &&
            isIncomingCall
        ) {
            var options = {
                localVideo: videoInput,
                remoteVideo: videoOutput,
                onicecandidate: onIceCandidate,
                onerror: onError,
            };
            console.log("useEffect ~ options:", options);
            const webRtcPeer = WebRtcPeer.WebRtcPeerSendrecv(
                options,
                function (error) {
                    if (error) {
                        return console.error(error);
                    }
                    webRtcPeer.generateOffer(onOfferIncomingCall);
                }
            );
        }
    }, [callState, videoInput, videoOutput, openCallDialog, isIncomingCall]);

    function register(id: number) {
        setRegisterState(REGISTER_STATE.REGISTERING);

        var message = {
            id: "register",
            name: id,
        };
        sendMessage(message);
    }

    function registerResponse(message: any) {
        if (message.response == "accepted") {
            setRegisterState(REGISTER_STATE.REGISTERED);
        } else {
            setRegisterState(REGISTER_STATE.NOT_REGISTERED);
            var errorMessage = message.message
                ? message.message
                : "Unknown reason for register rejection.";
            console.log(errorMessage);
        }
    }

    const call = (
        videoInput: HTMLVideoElement,
        videoOutput: HTMLVideoElement
    ) => {
        console.log("run call()");
        const options = {
            localVideo: videoInput,
            remoteVideo: videoOutput,
            onicecandidate: onIceCandidate,
            onerror: onError,
        };
        setCallState(CALL_STATE.PROCESSING_CALL);
        const webRtcPeer = WebRtcPeer.WebRtcPeerSendrecv(
            options,
            function (error: any) {
                if (error) {
                    return console.error(error);
                }
                webRtcPeer.generateOffer(onOfferCall);
            }
        );
        setWebRtcPeer(webRtcPeer);
    };

    const onOfferCall = (error: any, offerSdp: any) => {
        if (error) return console.error("Error generating the offer");
        console.log("Invoking SDP offer callback function");
        const message = {
            id: "call",
            from: decryptedData.user_id,
            to: targetUserId,
            sdpOffer: offerSdp,
        };
        sendMessage(message);
    };

    const incomingCall = (message: any) => {
        console.info("Incoming call from: " + message.from);
        // If bussy just reject without disturbing user
        if (callState != CALL_STATE.NO_CALL) {
            var response = {
                id: "incomingCallResponse",
                from: message.from,
                callResponse: "reject",
                message: "bussy",
            };
            return sendMessage(response);
        }

        setCallState(CALL_STATE.PROCESSING_CALL);
        if (
            confirm(
                "User " +
                    message.from +
                    " is calling you. Do you accept the call?"
            )
        ) {
            dispatch(setOpenCallDialog(true));
            setIsIncomingCall(true);
            setInComingCallId(message.from);
        } else {
            var response = {
                id: "incomingCallResponse",
                from: message.from,
                callResponse: "reject",
                message: "user declined",
            };
            sendMessage(response);
            stop(false);
        }
    };

    const onOfferIncomingCall = (error: any, offerSdp: any) => {
        if (error) return console.error("Error generating the offer");
        var response = {
            id: "incomingCallResponse",
            from: inComingCallId,
            callResponse: "accept",
            sdpOffer: offerSdp,
        };
        console.log("onOfferIncomingCall ~ response:", response);
        setIsIncomingCall(false);
        sendMessage(response);
    };

    const onIceCandidate = (candidate: any) => {
        console.log("Local candidate" + JSON.stringify(candidate));

        var message = {
            id: "onIceCandidate",
            candidate: candidate,
        };
        sendMessage(message);
    };

    const sendMessage = (message: any) => {
        var jsonMessage = JSON.stringify(message);
        console.log("Sending message: " + jsonMessage);
        socket?.send(jsonMessage);
    };

    const callResponse = (message: any) => {
        if (message.response != "accepted") {
            console.info("Call not accepted by peer. Closing call");
            var errorMessage = message.message
                ? message.message
                : "Unknown reason for call rejection.";
            console.log(errorMessage);
            toast.error(errorMessage);
            stop(false);
        } else {
            setCallState(CALL_STATE.IN_CALL);
            console.log("Call response message:", message);
            console.log("Call accepted by peer. Processing call");
            webRtcPeer?.processAnswer(message.sdpAnswer, function (error) {
                if (error) return console.error(error);
            });
        }
    };

    const onError = (error: any) => {
        console.error("Error: " + error);
        setCallState(CALL_STATE.NO_CALL);
    };

    function startCommunication(message: any) {
        setCallState(CALL_STATE.IN_CALL);
        webRtcPeer?.processAnswer(message.sdpAnswer, function (error) {
            if (error) return console.error(error);
        });
    }

    const stop = (value: boolean) => {
        setCallState(CALL_STATE.NO_CALL);
        if (webRtcPeer) {
            webRtcPeer.dispose();
            setWebRtcPeer(null);

            if (!value) {
                var msg = {
                    id: "stop",
                };
                sendMessage(msg);
            }
        }
    };

    const contextValues = {
        socket,
        register,
        call,
        setTargetUserId,
        setVideoInput,
        setVideoOutput,
        callState,
    };

    return (
        <CallContext.Provider
            {...props}
            value={contextValues}
        ></CallContext.Provider>
    );
}

export function useCall() {
    const context = React.useContext(CallContext);
    if (typeof context === "undefined")
        throw new Error("useCall must be used within CallProvider");
    return context;
}
