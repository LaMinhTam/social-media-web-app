import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
    Typography,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import React, { useCallback, useEffect, useState } from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { setOpenGroupCallDialog } from "@/store/actions/commonSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import { ConversationResponse } from "@/types/conversationType";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CopyToClipboard from "react-copy-to-clipboard";
import { CALL_GROUP_WS_URL } from "@/constants/global";
import { WebRtcPeer } from "kurento-utils";
import sendMessage from "@/utils/conversation/call-group/sendMessage";
import Participant from "./Participant";
import { toast } from "react-toastify";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

var ws: WebSocket;
var participants: any = {};

const GroupCallDialog = ({
    conversation,
    openGroupCallDialog,
    dispatch,
    name,
}: {
    conversation: ConversationResponse;
    openGroupCallDialog: boolean;
    dispatch: Dispatch<any>;
    name: string;
}) => {
    console.log("participant", participants);
    const handleClose: DialogProps["onClose"] = (event, reason) => {
        if (reason && reason === "backdropClick") return;
        dispatch(setOpenGroupCallDialog(false));
    };
    const [participantContainer, setParticipantContainer] =
        useState<HTMLDivElement | null>(null);
    console.log("participantContainer:", participantContainer);

    const participantsRef = useCallback((node: HTMLDivElement) => {
        if (node !== null) {
            setParticipantContainer(node);
        }
    }, []);

    const [isExistingParticipants, setIsExistingParticipants] = useState(false);
    const [existingParticipantsData, setExistingParticipantsData] =
        useState<any>(null);

    const [isReceiveVideo, setIsReceiveVideo] = useState(false);
    const [receiveVideoData, setReceiveVideoData] = useState<any>(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isMicEnabled, setIsMicEnabled] = useState(true);

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        ws = new WebSocket(CALL_GROUP_WS_URL);
        ws.onmessage = function (message) {
            var parsedMessage = JSON.parse(message.data);
            console.info("Received message: " + message.data);

            switch (parsedMessage.id) {
                case "existingParticipants":
                    onExistingParticipants(parsedMessage);
                    break;
                case "newParticipantArrived":
                    onNewParticipant(parsedMessage);
                    break;
                case "participantLeft":
                    onParticipantLeft(parsedMessage);
                    break;
                case "receiveVideoAnswer":
                    receiveVideoResponse(parsedMessage);
                    break;
                case "iceCandidate":
                    participants[parsedMessage.name].rtcPeer.addIceCandidate(
                        parsedMessage.candidate,
                        function (error: any) {
                            if (error) {
                                console.error(
                                    "Error adding candidate: " + error
                                );
                                return;
                            }
                        }
                    );
                    break;
                default:
                    console.error("Unrecognized message", parsedMessage);
            }
        };
        ws.onopen = function () {
            console.log("Connected to group call kurento server");
            // register();
            setIsReady(true);
        };
        ws.onclose = function () {
            for (var key in participants) {
                participants[key].dispose();
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        function existingParticipants(
            msg: any,
            constraints: any,
            participantContainer: HTMLDivElement
        ) {
            const participant = new Participant(name, ws, participantContainer);
            participants[name] = participant;
            const video = participant.getVideoElement();

            const options = {
                localVideo: video,
                mediaConstraints: constraints,
                onicecandidate: participant.onIceCandidate.bind(participant),
            };
            participant.rtcPeer = WebRtcPeer.WebRtcPeerSendonly(
                options,
                function (this: any, error) {
                    if (error) {
                        return console.error(error);
                    }
                    this.generateOffer(
                        participant.offerToReceiveVideo.bind(participant)
                    );
                }
            );

            msg.data.forEach(receiveVideo);
        }
        if (
            isExistingParticipants &&
            participantContainer &&
            existingParticipantsData
        ) {
            existingParticipants(
                existingParticipantsData,
                {
                    audio: true,
                    video: {
                        mandatory: {
                            maxWidth: 320,
                            maxFrameRate: 15,
                            minFrameRate: 15,
                        },
                    },
                },
                participantContainer
            );
        }
    }, [
        isExistingParticipants,
        participantContainer,
        existingParticipantsData,
    ]);

    useEffect(() => {
        function receiveVideo() {
            const participant = new Participant(
                receiveVideoData,
                ws,
                participantContainer!
            );
            participants[receiveVideoData] = participant;
            const video = participant.getVideoElement();

            const options = {
                remoteVideo: video,
                onicecandidate: participant.onIceCandidate.bind(participant),
            };

            participant.rtcPeer = WebRtcPeer.WebRtcPeerRecvonly(
                options,
                function (this: any, error) {
                    if (error) {
                        return console.error(error);
                    }
                    this.generateOffer(
                        participant.offerToReceiveVideo.bind(participant)
                    );
                }
            );
        }
        if (isReceiveVideo && participantContainer && receiveVideoData) {
            receiveVideo();
        }
    }, [isReceiveVideo, participantContainer, receiveVideoData]);

    useEffect(() => {
        if (isReady) {
            console.log("Registering...");
            register();
        }
    }, [isReady]);

    function register() {
        var message = {
            id: "joinRoom",
            name: name,
            room: conversation.conversation_id,
        };
        console.log("Registering in room " + conversation.conversation_id);
        sendMessage(message, ws);
    }

    function onNewParticipant(request: any) {
        receiveVideo(request.name);
    }

    function receiveVideoResponse(result: any) {
        participants[result.name].rtcPeer.processAnswer(
            result.sdpAnswer,
            function (error: any) {
                if (error) return console.error(error);
            }
        );
    }

    function onExistingParticipants(msg: any) {
        setExistingParticipantsData(msg);
        setIsExistingParticipants(true);
    }

    function leaveRoom() {
        sendMessage(
            {
                id: "leaveRoom",
            },
            ws
        );

        for (var key in participants) {
            participants[key].dispose();
        }
        dispatch(setOpenGroupCallDialog(false));
        ws.close();
    }

    function receiveVideo(sender: any) {
        setReceiveVideoData(sender);
        setIsReceiveVideo(true);
    }

    function onParticipantLeft(request: any) {
        toast.info("Participant " + request.name + " left");
        var participant = participants[request.name];
        participant.dispose();
        delete participants[request.name];
    }

    const toggleVideo = () => {
        setIsVideoEnabled(!isVideoEnabled);
        if (isVideoEnabled) {
            participants[name].disableVideo();
        } else {
            participants[name].enableVideo();
        }
    };

    const toggleMic = () => {
        setIsMicEnabled(!isMicEnabled);
        if (isMicEnabled) {
            participants[name].disableMic();
        } else {
            participants[name].enableMic();
        }
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openGroupCallDialog}
            disableEscapeKeyDown
            sx={{
                "& .MuiDialog-paper": {
                    width: "1140px",
                    maxWidth: "none",
                },
            }}
        >
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2,
                    textAlign: "center",
                    fontWeight: 700,
                }}
                id="customized-dialog-title"
            >
                Video Call Group {conversation.name}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={leaveRoom}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers className="relative w-full h-full">
                <div id="participants" ref={participantsRef}></div>
            </DialogContent>
            <DialogActions className="flex justify-center gap-2">
                <Box className="absolute w-[300px] right-2 flex items-center justify-between bg-secondary bg-opacity-10 px-3 h-[40px] rounded text-secondary">
                    <Typography>Copy link to share</Typography>
                    <CopyToClipboard
                        text={
                            `${window.location.origin}/group/call?groupId=` +
                            conversation.conversation_id
                        }
                    >
                        <IconButton
                            size="small"
                            color="inherit"
                            aria-label="copy"
                        >
                            <ContentCopyIcon />
                        </IconButton>
                    </CopyToClipboard>
                </Box>
                <Button
                    type="button"
                    variant="outlined"
                    className="rounded-full"
                    color="inherit"
                    onClick={toggleVideo}
                >
                    {!isVideoEnabled ? (
                        <VideocamOffIcon />
                    ) : (
                        <VideoCameraBackIcon />
                    )}
                    <KeyboardArrowUpIcon />
                </Button>
                <Button
                    type="button"
                    variant="outlined"
                    className="rounded-full"
                    color="inherit"
                    onClick={toggleMic}
                >
                    {!isMicEnabled ? <MicOffIcon /> : <MicIcon />}
                    <KeyboardArrowUpIcon />
                </Button>
                <Button
                    type="button"
                    variant="outlined"
                    className="rounded-full"
                    color="inherit"
                    startIcon={<LogoutIcon />}
                    onClick={leaveRoom}
                >
                    Leave
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default GroupCallDialog;
