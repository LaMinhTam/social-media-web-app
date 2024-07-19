import {
    Button,
    Grid,
    Menu,
    MenuItem,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import React from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import { PopupState } from "material-ui-popup-state/hooks";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";

const ProfileMenu = ({
    popupState,
    setOpenResetPasswordDialog,
    handleLogout,
}: {
    popupState: PopupState;
    setOpenResetPasswordDialog: (value: boolean) => void;
    handleLogout: () => void;
}) => {
    const router = useRouter();
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    return (
        <Grid container>
            <Grid item>
                <Button
                    onClick={() => router.push("/me")}
                    color="inherit"
                    className="flex items-center justify-start gap-x-3 w-[360px] normal-case"
                >
                    <AccountCircle />
                    <Typography>{currentUserProfile.name}</Typography>
                </Button>
            </Grid>
            <Grid
                item
                className="flex items-center justify-between gap-x-3 w-[360px]"
                onClick={() => setOpenResetPasswordDialog(true)}
            >
                <Button
                    className="flex items-center justify-center normal-case gap-x-3"
                    color="inherit"
                >
                    <RestartAltIcon />
                    <Typography>Reset Password</Typography>
                </Button>
                <ToggleButtonGroup />
            </Grid>
            <Grid
                item
                onClick={handleLogout}
                className="flex items-center justify-start gap-x-3 w-[360px]"
            >
                <Button
                    className="flex items-center justify-center normal-case gap-x-3"
                    color="inherit"
                >
                    <LogoutIcon />
                    <Typography>Logout</Typography>
                </Button>
            </Grid>
        </Grid>
    );
};

export default ProfileMenu;
