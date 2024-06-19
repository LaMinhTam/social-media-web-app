import {
    Box,
    Button,
    Checkbox,
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
import { GroupSettings } from "@/types/conversationType";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const SettingDialog = ({
    openSettingDialog,
    setOpenSettingDialog,
    settings,
}: {
    openSettingDialog: boolean;
    setOpenSettingDialog: (open: boolean) => void;
    settings: GroupSettings;
}) => {
    const handleClose = () => {
        setOpenSettingDialog(false);
    };
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openSettingDialog}
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
                Group chat settings
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
                <Grid
                    container
                    flexDirection={"column"}
                    alignItems={"start"}
                    justifyContent={"center"}
                    className="w-full"
                >
                    <Grid item className="w-full h-full">
                        <Typography className="font-semibold ">
                            Allow group members to
                        </Typography>
                    </Grid>
                    <Grid item className="w-full h-full">
                        <Box className="flex items-center justify-between flex-1">
                            <Typography className="text-sm font-medium">
                                Change group name & avatar
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                defaultChecked={
                                    settings.allow_member_to_change_group_info
                                }
                            />
                        </Box>
                        <Box className="flex items-center justify-between flex-1">
                            <Typography className="text-sm font-medium">
                                Invite new member
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                defaultChecked={
                                    settings.allow_member_to_invite_member
                                }
                            />
                        </Box>
                        <Box className="flex items-center justify-between flex-1">
                            <Typography className="text-sm font-medium">
                                Pin message
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                defaultChecked={
                                    settings.allow_member_to_pin_message
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid item className="w-full h-full py-1">
                        <hr />
                    </Grid>
                    <Grid item className="w-full h-full">
                        <Typography className="font-semibold ">
                            Allow deputy to
                        </Typography>
                    </Grid>
                    <Grid item className="w-full h-full">
                        <Box className="flex items-center justify-between flex-1">
                            <Typography className="text-sm font-medium">
                                Send message
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                defaultChecked={
                                    settings.allow_deputy_send_messages
                                }
                            />
                        </Box>
                        <Box className="flex items-center justify-between flex-1">
                            <Typography className="text-sm font-medium">
                                Invite member
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                defaultChecked={
                                    settings.allow_deputy_to_invite_member
                                }
                            />
                        </Box>
                        <Box className="flex items-center justify-between flex-1">
                            <Typography className="text-sm font-medium">
                                Remove member
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                defaultChecked={
                                    settings.allow_deputy_remove_member
                                }
                            />
                        </Box>
                        <Box className="flex items-center justify-between flex-1">
                            <Typography className="text-sm font-medium">
                                Promote member
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                defaultChecked={
                                    settings.allow_deputy_promote_member
                                }
                            />
                        </Box>
                        <Box className="flex items-center justify-between flex-1">
                            <Typography className="text-sm font-medium">
                                Demote member
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                defaultChecked={
                                    settings.allow_deputy_demote_member
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid item className="w-full h-full py-1">
                        <hr />
                    </Grid>
                    <Grid item className="w-full h-full">
                        <Typography className="font-semibold ">
                            Admin settings
                        </Typography>
                    </Grid>
                    <Grid item className="w-full h-full">
                        <Box className="flex items-center justify-between flex-1">
                            <Typography className="text-sm font-medium">
                                Restrict members from sending messages
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                defaultChecked={settings.restricted_messaging}
                            />
                        </Box>
                        <Box className="flex items-center justify-between flex-1">
                            <Typography className="text-sm font-medium">
                                Allow member join with link
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                defaultChecked={settings.join_by_link}
                            />
                        </Box>
                        <Box className="flex items-center justify-between flex-1">
                            <Typography className="text-sm font-medium">
                                Confirm new member join
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                defaultChecked={settings.confirm_new_member}
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

export default SettingDialog;
