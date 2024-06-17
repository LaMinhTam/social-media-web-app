import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const RemoveMessageDialog = ({
    openDeleteDialog,
    setOpenDeleteDialog,
    onRemoveMessage,
}: {
    openDeleteDialog: boolean;
    setOpenDeleteDialog: (open: boolean) => void;
    onRemoveMessage: () => void;
}) => {
    const handleClose = () => {
        setOpenDeleteDialog(false);
    };
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openDeleteDialog}
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
                Remove for you
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
            <DialogContent dividers>
                <Typography className="text-sm text-gray-500">
                    This will remove the message from your devices. Other chat
                    members will still be able to see it.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="info">
                    Cancel
                </Button>
                <Button
                    autoFocus
                    onClick={onRemoveMessage}
                    variant="contained"
                    color="info"
                >
                    Remove
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default RemoveMessageDialog;
