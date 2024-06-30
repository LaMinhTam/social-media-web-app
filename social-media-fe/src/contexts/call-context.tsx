import { CALL_STATE, CALL_WS_URL, REGISTER_STATE } from "@/constants/global";
import { findUserById } from "@/services/search.service";
import {
    setOpenCallDialog,
    setOpenIncomingCallDialog,
} from "@/store/actions/commonSlice";
import { RootState } from "@/store/configureStore";
import CallType from "@/types/callType";
import { Member } from "@/types/conversationType";
import getUserInfoFromCookie from "@/utils/auth/getUserInfoFromCookie";
import { WebRtcPeer } from "kurento-utils";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CallContext = React.createContext<CallType>({} as CallType);
var webRtcPeer: WebRtcPeer | null;
var socket: WebSocket | null;

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
    const [isAccepted, setIsAccepted] = React.useState<boolean>(false);
    const [isIncomingCall, setIsIncomingCall] = React.useState<boolean>(false);
    const [inComingCallId, setInComingCallId] = React.useState<number>(-1);
    const [registerState, setRegisterState] = React.useState<number>(0);
    const [videoInput, setVideoInput] = React.useState<HTMLVideoElement | null>(
        null
    );
    const [videoOutput, setVideoOutput] =
        React.useState<HTMLVideoElement | null>(null);
    const [targetUser, setTargetUser] = React.useState<Member | null>(null);
    useEffect(() => {
        socket = new WebSocket(CALL_WS_URL);
        console.log("Attempting to open WebSocket connection...");
        socket.onopen = () => {
            console.log("WebSocket kurento connection opened");
            setIsReady(true);
        };

        socket.onclose = (event) => {
            console.log("WebSocket kurento connection closed: ", event);
        };

        socket.onerror = (error) => {
            console.log("WebSocket kurento error: ", error);
        };
        socket.onmessage = (message) => {
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

        return () => {
            socket?.close();
        };
    }, []);

    useEffect(() => {
        if (isReady && decryptedData) {
            register(decryptedData.user_id);
            setIsReady(false);
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
            webRtcPeer = WebRtcPeer.WebRtcPeerSendrecv(
                options,
                function (error) {
                    if (error) {
                        return console.error(error);
                    }
                    webRtcPeer?.generateOffer(onOfferIncomingCall);
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
        const options = {
            localVideo: videoInput,
            remoteVideo: videoOutput,
            onicecandidate: onIceCandidate,
            onerror: onError,
        };
        setCallState(CALL_STATE.PROCESSING_CALL);
        webRtcPeer = WebRtcPeer.WebRtcPeerSendrecv(
            options,
            function (error: any) {
                if (error) {
                    return console.error(error);
                }
                webRtcPeer?.generateOffer(onOfferCall);
            }
        );
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

    const incomingCall = async (message: any) => {
        // If busy just reject without disturbing user
        if (callState != CALL_STATE.NO_CALL) {
            var response = {
                id: "incomingCallResponse",
                from: message.from,
                callResponse: "reject",
                message: "busy",
            };
            return sendMessage(response);
        }

        // Find user details
        const user = await findUserById(message.from);
        if (user) setTargetUser(user);
        const imageUrl =
            "https://ddk.1cdn.vn/2023/05/13/image.daidoanket.vn-images-upload-vanmt-05132023-_img_2173.jpg";
        // user?.image_url || "https://source.unsplash.com/random";

        Swal.fire({
            title: "Incoming Call",
            text: `You have an incoming call from ${
                user ? user.name : "Unknown Caller"
            }. Do you want to accept it?`,
            icon: "question",
            imageUrl: imageUrl,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, accept it!",
            cancelButtonText: "No, reject it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setCallState(CALL_STATE.PROCESSING_CALL);
                dispatch(setOpenCallDialog(true));
                setIsIncomingCall(true);
                setInComingCallId(message.from);
            } else {
                console.log("Call rejected");
                var response = {
                    id: "incomingCallResponse",
                    from: message.from,
                    callResponse: "reject",
                    message: "user declined",
                };
                sendMessage(response);
                stop();
            }
        });
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
            stop();
            dispatch(setOpenCallDialog(false));
        } else {
            setCallState(CALL_STATE.IN_CALL);
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

    const stop = (message?: any) => {
        setCallState(CALL_STATE.NO_CALL);
        if (webRtcPeer) {
            webRtcPeer.dispose();
            webRtcPeer = null;
            dispatch(setOpenCallDialog(false));
            if (!message) {
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
        stop,
        targetUserId,
        targetUser,
        setTargetUser,
        isAccepted,
        setIsAccepted,
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
