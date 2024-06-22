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
import React, { useState } from "react";
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
    setOpenVideoCallDialog,
}: {
    openVideoCallDialog: boolean;
    setOpenVideoCallDialog: (open: boolean) => void;
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const handleClose = () => {
        setOpenVideoCallDialog(false);
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
                <video
                    src=""
                    className="object-cover w-full h-[300px] bg-strock rounded shadow-md"
                ></video>
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
