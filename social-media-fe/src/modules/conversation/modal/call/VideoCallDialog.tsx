import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
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
    const { call, setVideoInput, setVideoOutput, callState } = useCall();
    const [loading, setLoading] = useState<boolean>(false);
    const [videoInputElement, setVideoInputElement] =
        useState<HTMLVideoElement | null>(null);
    const [videoOutputElement, setVideoOutputElement] =
        useState<HTMLVideoElement | null>(null);

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

    const handleClose = () => {
        dispatch(setOpenCallDialog(false));
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openVideoCallDialog}
            onBackdropClick={handleClose}
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
                Calling to ...
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers className="w-[548px] h-full">
                <div className="flex flex-col items-center justify-center">
                    <video
                        id="videoOutput"
                        ref={videoOutputRef}
                        autoPlay
                        playsInline
                        className="w-full h-full"
                    ></video>
                    <video
                        id="videoInput"
                        ref={videoInputRef}
                        autoPlay
                        playsInline
                        className="w-full h-full"
                    ></video>
                </div>
            </DialogContent>
            <DialogActions className="flex justify-center gap-2">
                <Button
                    type="button"
                    variant="outlined"
                    className="rounded-full"
                    color="inherit"
                >
                    <VideoCameraBackIcon />
                    <KeyboardArrowUpIcon />
                </Button>
                <Button
                    type="button"
                    color="inherit"
                    variant="outlined"
                    className="rounded-full bg-darkRed text-lite hover:bg-darkRed hover:text-lite"
                >
                    <CallEndIcon />
                </Button>
                <Button
                    type="button"
                    variant="outlined"
                    className="rounded-full"
                    color="inherit"
                >
                    <MicIcon />
                    <KeyboardArrowUpIcon />
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default VideoCallDialog;
