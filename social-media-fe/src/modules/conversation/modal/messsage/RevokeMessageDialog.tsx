import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Typography,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { MutableRefObject } from "react";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const RevokeMessageDialog = ({
    openDeleteDialog,
    setOpenDeleteDialog,
    onRevokeMessage,
    onRemoveMessage,
}: {
    openDeleteDialog: boolean;
    setOpenDeleteDialog: (open: boolean) => void;
    onRevokeMessage: () => void;
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
                Who do you want to remove this message for?
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
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="REVOKE"
                    name="radio-buttons-group"
                >
                    <Grid
                        container
                        flexDirection={"row"}
                        alignItems={"start"}
                        justifyContent={"start"}
                        spacing={1}
                    >
                        <Grid item flex={"1"}>
                            <FormControlLabel
                                value="REVOKE"
                                control={<Radio />}
                                label="Unsend for everyone"
                                className="font-bold"
                            />
                            <Typography className="text-sm text-gray-500">
                                This message will be unsent for everyone in the
                                chat. Others may have already seen or forwarded
                                it. Unsent messages can still be included in
                                reports.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        flexDirection={"row"}
                        alignItems={"start"}
                        justifyContent={"start"}
                        spacing={1}
                    >
                        <Grid item flex={"1"}>
                            <FormControlLabel
                                value="REMOVE"
                                control={<Radio />}
                                label="Remove for you"
                                className="font-bold"
                            />
                            <Typography className="text-sm text-gray-500">
                                This will remove the message from your devices.
                                Other chat members will still be able to see it.
                            </Typography>
                        </Grid>
                    </Grid>
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="info">
                    Cancel
                </Button>
                <Button
                    autoFocus
                    onClick={onRevokeMessage}
                    variant="contained"
                    color="info"
                >
                    Remove
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default RevokeMessageDialog;
