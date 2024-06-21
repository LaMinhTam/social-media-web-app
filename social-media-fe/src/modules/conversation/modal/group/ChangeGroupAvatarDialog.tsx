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
import {
    handleChangeGroupAvatar,
    handleUploadFile,
} from "@/services/conversation.service";
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
const ChangeAvatarDialog = ({
    popupState,
    openChangeAvatarDialog,
    setOpenChangeAvatarDialog,
    currentAvatar,
    conversationId,
}: {
    popupState: PopupState;
    openChangeAvatarDialog: boolean;
    setOpenChangeAvatarDialog: (open: boolean) => void;
    currentAvatar: string;
    conversationId: string;
}) => {
    const [file, setFile] = React.useState<File>({} as File);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [imageUrl, setImageUrl] = React.useState<string>("");
    const handleClose = () => {
        setOpenChangeAvatarDialog(false);
    };
    const onChangeAvatar = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(files[0]);
        }
    };
    const handleSave = async () => {
        if (file) {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
            );
            formData.append("public_id", file.name);
            formData.append("folder", `conversation/${conversationId}`);
            const imageUrl = await handleUploadFile(formData);
            if (imageUrl) {
                const res = await handleChangeGroupAvatar(
                    conversationId,
                    imageUrl
                );
                if (res) {
                    setOpenChangeAvatarDialog(false);
                    popupState.close();
                    toast.success("Change avatar successfully");
                }
            }
            setLoading(false);
        }
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
                        <Box className="w-full h-[300px] rounded-lg bg-strock">
                            <img
                                src={imageUrl ? imageUrl : currentAvatar}
                                alt="current avatar"
                                className="object-scale-down w-full h-full rounded-lg"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" fontWeight={600}>
                            Change avatar
                        </Typography>
                        <input
                            type="file"
                            className="w-full"
                            accept="image/*"
                            multiple={false}
                            onChange={onChangeAvatar}
                        />
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
                    onClick={handleSave}
                >
                    {loading ? <LoadingSpinner /> : "Save"}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default ChangeAvatarDialog;
