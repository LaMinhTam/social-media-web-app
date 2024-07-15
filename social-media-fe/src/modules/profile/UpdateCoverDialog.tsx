import {
    Box,
    Button,
    CircularProgress,
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import Image from "next/image";
import { handleUpdateProfile } from "@/services/profile.service";
import { setCurrentUserProfile } from "@/store/actions/profileSlice";
import saveUserInfoToCookie from "@/utils/auth/saveUserInfoToCookie";
import { getAccessToken } from "@/utils/auth";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const UpdateCoverDialog = ({
    openUpdateCoverDialog,
    setOpenUpdateCoverDialog,
    type = "cover",
}: {
    openUpdateCoverDialog: boolean;
    setOpenUpdateCoverDialog: (open: boolean) => void;
    type?: string;
}) => {
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const dispatch = useDispatch();
    const [file, setFile] = React.useState<File>({} as File);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [imageUrl, setImageUrl] = React.useState<string>("");
    const progress = useSelector((state: RootState) => state.common.progress);
    const handleClose = () => {
        setOpenUpdateCoverDialog(false);
    };
    const accessToken = getAccessToken();
    const initImage =
        type === "cover"
            ? currentUserProfile.cover
            : currentUserProfile.image_url;
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
            formData.append("folder", `user/${currentUserProfile.user_id}`);
            const imageUrl = await handleUploadFile(formData, dispatch);
            if (imageUrl) {
                const data = {
                    name: currentUserProfile.name,
                    image_url:
                        type === "avatar"
                            ? imageUrl
                            : currentUserProfile.image_url,
                    cover:
                        type === "cover" ? imageUrl : currentUserProfile.cover,
                };
                const response = await handleUpdateProfile(data);
                if (response) {
                    toast.success(
                        `Update ${
                            type === "cover" ? "cover" : "avatar"
                        } successfully!`
                    );
                    dispatch(setCurrentUserProfile(response));
                    saveUserInfoToCookie(response, accessToken || "");
                    setOpenUpdateCoverDialog(false);
                } else {
                    toast.error(
                        `Update ${
                            type === "cover" ? "cover" : "avatar"
                        } failed!`
                    );
                }
            }
            setLoading(false);
        }
    };
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openUpdateCoverDialog}
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
                Update cover
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
                            Current {type}
                        </Typography>
                        <Box className="w-full h-[300px] rounded-lg bg-strock relative flex items-center justify-center">
                            {progress > 0 ? (
                                <div className="flex items-center justify-center">
                                    <CircularProgress
                                        variant="determinate"
                                        value={progress}
                                    />
                                </div>
                            ) : (
                                <Image
                                    src={imageUrl ? imageUrl : initImage}
                                    layout="fill"
                                    sizes="100%"
                                    objectFit="cover"
                                    alt="current cover"
                                    className="rounded-lg"
                                />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" fontWeight={600}>
                            Change {type}
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

export default UpdateCoverDialog;
