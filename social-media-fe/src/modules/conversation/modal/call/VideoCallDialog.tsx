import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CallEndIcon from "@mui/icons-material/CallEnd";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import MicIcon from "@mui/icons-material/Mic";
import React, { useCallback, useEffect, useState } from "react";
import { useCall } from "@/contexts/call-context";
import { CALL_STATE } from "@/constants/global";
import { Dispatch } from "@reduxjs/toolkit";
import { setOpenCallDialog } from "@/store/actions/commonSlice";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const VideoCallDialog = ({
    openVideoCallDialog,
    dispatch,
}: {
    openVideoCallDialog: boolean;
    dispatch: Dispatch<any>;
}) => {
    const {
        call,
        setVideoInput,
        setVideoOutput,
        callState,
        stop,
        targetUser,
        webRtcPeer,
        // toggleVideo,
        // toggleMic,
    } = useCall();
    const [loading, setLoading] = useState<boolean>(false);
    const [videoInputElement, setVideoInputElement] =
        useState<HTMLVideoElement | null>(null);
    const [videoOutputElement, setVideoOutputElement] =
        useState<HTMLVideoElement | null>(null);

    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isMicEnabled, setIsMicEnabled] = useState(true);

    const videoInputRef = useCallback((node: HTMLVideoElement) => {
        if (node !== null) {
            setVideoInputElement(node);
        }
    }, []);

    const videoOutputRef = useCallback((node: HTMLVideoElement) => {
        if (node !== null) {
            setVideoOutputElement(node);
        }
    }, []);

    useEffect(() => {
        if (videoInputElement && videoOutputElement) {
            setVideoInput(videoInputElement);
            setVideoOutput(videoOutputElement);
        }
    }, [videoInputElement, videoOutputElement]);

    useEffect(() => {
        if (
            videoInputElement &&
            videoOutputElement &&
            callState === CALL_STATE.NO_CALL
        ) {
            setLoading(true);
            call(videoInputElement, videoOutputElement);
        }
    }, [videoInputElement, videoOutputElement]);

    const handleClose: DialogProps["onClose"] = (event, reason) => {
        if (reason && reason === "backdropClick") return;
        dispatch(setOpenCallDialog(false));
    };

    const handleToggleVideo = () => {
        console.log("handleToggleVideo");
        setIsVideoEnabled(!isVideoEnabled);
        if (isVideoEnabled && webRtcPeer) {
            const videoTrack = webRtcPeer.getLocalStream().getVideoTracks()[0];
            if (videoTrack) videoTrack.enabled = false;
        } else {
            const videoTrack = webRtcPeer?.getLocalStream().getVideoTracks()[0];
            if (videoTrack) videoTrack.enabled = true;
        }
    };

    const handleToggleMic = () => {
        console.log("handleToggleMic");
        setIsMicEnabled(!isMicEnabled);
        if (isMicEnabled && webRtcPeer) {
            const audioTrack = webRtcPeer.getLocalStream().getAudioTracks()[0];
            if (audioTrack) audioTrack.enabled = false;
        } else {
            const audioTrack = webRtcPeer?.getLocalStream().getAudioTracks()[0];
            if (audioTrack) audioTrack.enabled = true;
        }
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openVideoCallDialog}
            disableEscapeKeyDown
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
                {callState === CALL_STATE.NO_CALL ||
                    (callState === CALL_STATE.PROCESSING_CALL &&
                        `Calling to ${targetUser?.name || "Unknown"}`)}
                {callState === CALL_STATE.IN_CALL &&
                    `Video call ${targetUser?.name || "Unknown"}`}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => stop()}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers className="w-[548px] h-[350px] relative">
                <div className="flex flex-col items-center justify-center h-[350px]">
                    <video
                        id="videoOutput"
                        ref={videoOutputRef}
                        autoPlay
                        playsInline
                        className={`${
                            callState === CALL_STATE.IN_CALL
                                ? "w-full h-full"
                                : "hidden"
                        }`}
                    ></video>
                    <video
                        id="videoInput"
                        ref={videoInputRef}
                        autoPlay
                        playsInline
                        className={`${
                            callState === CALL_STATE.IN_CALL
                                ? "absolute top-0 right-0 w-1/4 max-w-xs h-1/4 max-h-20"
                                : "w-full h-full"
                        }`}
                    ></video>
                </div>
            </DialogContent>
            <DialogActions className="flex justify-center gap-2">
                <Button
                    type="button"
                    variant="outlined"
                    className="rounded-full"
                    color="inherit"
                    onClick={handleToggleVideo}
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
                    color="inherit"
                    variant="outlined"
                    className="rounded-full bg-darkRed text-lite hover:bg-darkRed hover:text-lite"
                    onClick={() => {
                        stop();
                    }}
                >
                    <CallEndIcon />
                </Button>
                <Button
                    type="button"
                    variant="outlined"
                    className="rounded-full"
                    color="inherit"
                    onClick={handleToggleMic}
                >
                    {!isMicEnabled ? <MicOffIcon /> : <MicIcon />}
                    <KeyboardArrowUpIcon />
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default VideoCallDialog;
