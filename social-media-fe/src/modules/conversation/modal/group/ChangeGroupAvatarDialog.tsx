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
import React from "react";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const ChangeAvatarDialog = ({
    openChangeAvatarDialog,
    setOpenChangeAvatarDialog,
    currentAvatar,
}: {
    openChangeAvatarDialog: boolean;
    setOpenChangeAvatarDialog: (open: boolean) => void;
    currentAvatar: string;
}) => {
    const handleClose = () => {
        setOpenChangeAvatarDialog(false);
    };
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openChangeAvatarDialog}
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
                Change group avatar
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
                        <Typography variant="body1" fontWeight={600}>
                            Current avatar
                        </Typography>
                        <Box className="w-full h-[300px] rounded-lg">
                            <img
                                src={currentAvatar}
                                alt="current avatar"
                                className="object-scale-down w-full h-full rounded-lg"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" fontWeight={600}>
                            Change avatar
                        </Typography>
                        <input type="file" className="w-full" />
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

export default ChangeAvatarDialog;
