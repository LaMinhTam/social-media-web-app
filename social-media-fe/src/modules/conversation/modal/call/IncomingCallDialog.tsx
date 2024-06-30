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
import CallIcon from "@mui/icons-material/Call";
import React, { useState } from "react";
import Image from "next/image";
import { Dispatch } from "@reduxjs/toolkit";
import { setOpenIncomingCallDialog } from "@/store/actions/commonSlice";
import { useCall } from "@/contexts/call-context";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const IncomingCallDialog = ({
    openIncomingCallDialog,
    dispatch,
}: {
    openIncomingCallDialog: boolean;
    dispatch: Dispatch<any>;
}) => {
    const handleClose: DialogProps["onClose"] = (event, reason) => {
        if (reason && reason === "backdropClick") return;
        dispatch(setOpenIncomingCallDialog(false));
    };
    const { targetUser, setIsAccepted } = useCall();

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openIncomingCallDialog}
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
                {targetUser?.name} is calling you
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => dispatch(setOpenIncomingCallDialog(false))}
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
                <Image
                    src={
                        targetUser?.image_url ||
                        "https://source.unsplash.com/random"
                    }
                    alt={targetUser?.name || "Unknown"}
                    width={548}
                    height={350}
                    className="w-[548px] h-[350px] object-cover rounded-lg"
                ></Image>
            </DialogContent>
            <DialogActions className="flex justify-center gap-2">
                <Button
                    onClick={() => {
                        setIsAccepted(true);
                        dispatch(setOpenIncomingCallDialog(false));
                    }}
                    variant="contained"
                    color="success"
                    startIcon={<CallIcon />}
                >
                    Accept
                </Button>
                <Button
                    onClick={() => {
                        setIsAccepted(false);
                        dispatch(setOpenIncomingCallDialog(false));
                    }}
                    variant="contained"
                    color="error"
                    startIcon={<CallEndIcon />}
                >
                    Reject
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default IncomingCallDialog;
