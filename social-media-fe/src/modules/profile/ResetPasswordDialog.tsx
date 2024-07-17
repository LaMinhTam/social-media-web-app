import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    styled,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import { toast } from "react-toastify";
import { SOCIAL_MEDIA_API } from "@/apis/constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const schema = yup.object({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
            }
        )
        .required("New password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Passwords must match")
        .required("Confirm new password is required"),
});

const ResetPasswordDialog = ({
    openResetPasswordDialog,
    setOpenResetPasswordDialog,
}: {
    openResetPasswordDialog: boolean;
    setOpenResetPasswordDialog: (open: boolean) => void;
}) => {
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState<boolean>(false);
    const handleClose = () => {
        setOpenResetPasswordDialog(false);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleSave = async (data: any) => {
        setLoading(true);
        try {
            const response = await SOCIAL_MEDIA_API.AUTH.resetPassword(
                data.oldPassword,
                data.newPassword
            );
            if (response.status === 200) {
                toast.success("Reset password successfully");
                setOpenResetPasswordDialog(false);
            }
        } catch (error) {
            toast.error("Reset password failed");
        }
        setLoading(false);
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openResetPasswordDialog}
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
                Reset Password
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
                <form onSubmit={handleSubmit(handleSave)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Old password"
                                variant="outlined"
                                type="password"
                                {...register("oldPassword")}
                                error={!!errors.oldPassword}
                                helperText={errors.oldPassword?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="New password"
                                variant="outlined"
                                type="password"
                                {...register("newPassword")}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Confirm new password"
                                variant="outlined"
                                type="password"
                                {...register("confirmPassword")}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                            />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button onClick={handleClose} color="info">
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="info"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner /> : "Save"}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </BootstrapDialog>
    );
};

export default ResetPasswordDialog;
