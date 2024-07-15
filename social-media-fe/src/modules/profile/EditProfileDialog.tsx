import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useRef } from "react";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import Image from "next/image";
import { handleUploadFile } from "@/services/conversation.service";
import { handleUpdateProfile } from "@/services/profile.service";
import { toast } from "react-toastify";
import saveUserInfoToCookie from "@/utils/auth/saveUserInfoToCookie";
import { getAccessToken } from "@/utils/auth";
import { setCurrentUserProfile } from "@/store/actions/profileSlice";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const EditProfileDialog = ({
    openEditProfileDialog,
    setOpenEditProfileDialog,
}: {
    openEditProfileDialog: boolean;
    setOpenEditProfileDialog: (open: boolean) => void;
}) => {
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const accessToken = getAccessToken();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = React.useState<string>(
        currentUserProfile.image_url
    );
    const [coverUrl, setCoverUrl] = React.useState<string>(
        currentUserProfile.cover
    );
    const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
    const [coverFile, setCoverFile] = React.useState<File | null>(null);
    const [name, setName] = React.useState<string>(currentUserProfile.name);
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState<boolean>(false);
    const handleClose = () => {
        setOpenEditProfileDialog(false);
    };
    const handleSave = async () => {
        try {
            setLoading(true);
            let avatar = "";
            let cover = "";
            if (avatarFile) {
                const formData = new FormData();
                formData.append("file", avatarFile);
                formData.append(
                    "upload_preset",
                    process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
                );
                formData.append("public_id", avatarFile.name);
                formData.append("folder", `user/${currentUserProfile.user_id}`);
                avatar = await handleUploadFile(formData, dispatch);
            }
            if (coverFile) {
                const formData = new FormData();
                formData.append("file", coverFile);
                formData.append(
                    "upload_preset",
                    process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
                );
                formData.append("public_id", coverFile.name);
                formData.append("folder", `user/${currentUserProfile.user_id}`);
                cover = await handleUploadFile(formData, dispatch);
            }
            const data = {
                name,
                image_url: avatar || currentUserProfile.image_url,
                cover: cover || currentUserProfile.cover,
            };
            const response = await handleUpdateProfile(data);
            if (response) {
                setOpenEditProfileDialog(false);
                saveUserInfoToCookie(response, accessToken || "");
                dispatch(setCurrentUserProfile(response));
                toast.success("Update profile successfully");
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const onChangeFile = async (
        event: React.ChangeEvent<HTMLInputElement>,
        type: string
    ) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            if (type === "avatar") {
                setAvatarFile(files[0]);
            }
            if (type === "cover") {
                setCoverFile(files[0]);
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === "avatar") {
                    setAvatarUrl(reader.result as string);
                }
                if (type === "cover") {
                    setCoverUrl(reader.result as string);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openEditProfileDialog}
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
                Update profile
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
                <Grid container>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography variant="h6">Name</Typography>
                        </Box>
                        <Box>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography variant="h6">Avatar</Typography>
                            <Box>
                                <Button
                                    onClick={() => {
                                        if (avatarInputRef.current) {
                                            avatarInputRef.current.click();
                                        }
                                    }}
                                >
                                    Edit
                                </Button>
                                <input
                                    type="file"
                                    ref={avatarInputRef}
                                    accept="image/*"
                                    multiple={false}
                                    style={{ display: "none" }}
                                    onChange={(e) => onChangeFile(e, "avatar")}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Image
                                src={avatarUrl}
                                width={168}
                                height={168}
                                alt="avatar"
                                className="w-[168px] h-[168px] rounded-full object-cover"
                            ></Image>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography variant="h6">Cover photo</Typography>
                            <Box>
                                <Button
                                    onClick={() => {
                                        if (coverInputRef.current) {
                                            coverInputRef.current.click();
                                        }
                                    }}
                                >
                                    Edit
                                </Button>
                                <input
                                    type="file"
                                    ref={coverInputRef}
                                    accept="image/*"
                                    multiple={false}
                                    style={{ display: "none" }}
                                    onChange={(e) => onChangeFile(e, "cover")}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Image
                                src={coverUrl}
                                width={500}
                                height={250}
                                alt="avatar"
                                className="w-[500px] h-[250px] rounded-lg object-cover"
                            ></Image>
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
                    onClick={handleSave}
                >
                    {loading ? <LoadingSpinner /> : "Save"}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default EditProfileDialog;
