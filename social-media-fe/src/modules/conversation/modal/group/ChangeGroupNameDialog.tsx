import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { MutableRefObject, useState } from "react";
import { handleChangeGroupName } from "@/services/conversation.service";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { PopupState } from "material-ui-popup-state/hooks";
import { toast } from "react-toastify";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const ChangeGroupNameDialog = ({
    popupState,
    conversationId,
    openChangeGroupNameDialog,
    setOpenChangeGroupNameDialog,
    currentGroupName,
}: {
    popupState: PopupState;
    conversationId: string;
    openChangeGroupNameDialog: boolean;
    setOpenChangeGroupNameDialog: (open: boolean) => void;
    currentGroupName: string;
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(currentGroupName || "");
    const handleClose = () => {
        setOpenChangeGroupNameDialog(false);
    };
    const onChangeGroupName = async () => {
        if (!name || name === currentGroupName) return;
        try {
            setLoading(true);
            const response = await handleChangeGroupName(conversationId, name);
            if (response) {
                setOpenChangeGroupNameDialog(false);
                popupState.close();
                toast.success("Change group name successfully");
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openChangeGroupNameDialog}
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
                Change group name
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
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body1">Group name</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-10 px-2 border border-gray-300 rounded-md"
                            />
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="info">
                    Cancel
                </Button>
                <Button
                    autoFocus
                    variant="contained"
                    color="info"
                    disabled={loading}
                    onClick={onChangeGroupName}
                >
                    {loading ? <LoadingSpinner /> : "Save"}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default ChangeGroupNameDialog;
