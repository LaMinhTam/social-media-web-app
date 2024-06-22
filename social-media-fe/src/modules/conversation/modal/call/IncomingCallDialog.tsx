import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CallEndIcon from "@mui/icons-material/CallEnd";
import CallIcon from "@mui/icons-material/Call";
import React, { useState } from "react";
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
    setOpenIncomingCallDialog,
}: {
    openIncomingCallDialog: boolean;
    setOpenIncomingCallDialog: (open: boolean) => void;
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const handleClose = () => {
        setOpenIncomingCallDialog(false);
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openIncomingCallDialog}
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
                ... is calling
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
                <IconButton
                    type="button"
                    color="inherit"
                    className="rounded-full bg-darkRed text-lite hover:bg-darkRed hover:text-lite"
                >
                    <CallEndIcon />
                </IconButton>
                <IconButton
                    type="button"
                    color="inherit"
                    className="rounded-full bg-strock text-lite hover:bg-darkRed hover:text-lite"
                >
                    <CallIcon />
                </IconButton>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default IncomingCallDialog;
