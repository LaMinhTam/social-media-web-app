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
import React, { MutableRefObject } from "react";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const ChangeGroupNameDialog = ({
    openChangeGroupNameDialog,
    setOpenChangeGroupNameDialog,
    currentGroupName,
}: {
    openChangeGroupNameDialog: boolean;
    setOpenChangeGroupNameDialog: (open: boolean) => void;
    currentGroupName: string;
}) => {
    const handleClose = () => {
        setOpenChangeGroupNameDialog(false);
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
                                defaultValue={currentGroupName}
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
                <Button autoFocus variant="contained" color="info">
                    Save
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default ChangeGroupNameDialog;
