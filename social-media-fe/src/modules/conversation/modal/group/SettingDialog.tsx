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
import React, { useState } from "react";
import { GroupSettings } from "@/types/conversationType";
import { handleUpdateGroupSettings } from "@/services/conversation.service";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { PopupState } from "material-ui-popup-state/hooks";
import { RootState } from "@/store/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentConversation } from "@/store/actions/conversationSlice";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const SettingDialog = ({
    conversationId,
    popupState,
    openSettingDialog,
    setOpenSettingDialog,
    settings,
}: {
    conversationId: string;
    popupState: PopupState;
    openSettingDialog: boolean;
    setOpenSettingDialog: (open: boolean) => void;
    settings: GroupSettings;
}) => {
    const [loading, setLoading] = useState(false);
    const currentConversation = useSelector(
        (state: RootState) => state.conversation.currentConversation
    );
    const dispatch = useDispatch();
    const handleClose = () => {
        setOpenSettingDialog(false);
    };
    const [newSettings, setNewSettings] = useState<GroupSettings>(settings);

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewSettings({
            ...newSettings,
            [event.target.name]: event.target.checked,
        });
    };
    const onUpdateGroupSettings = async () => {
        setLoading(true);
        const { link_to_join_group, ...settingsWithoutLink } = newSettings;
        const settingsWithPrefix = Object.keys(settingsWithoutLink).reduce(
            (obj, key) => {
                return {
                    ...obj,
                    ["is_" + key]:
                        settingsWithoutLink[
                            key as keyof typeof settingsWithoutLink
                        ],
                };
            },
            {}
        );
        const response = await handleUpdateGroupSettings(
            conversationId,
            settingsWithPrefix
        );
        if (response) {
            handleClose();
            popupState.close();
            const newCurrentConversation = {
                ...currentConversation,
                settings: response,
            };
            dispatch(setCurrentConversation(newCurrentConversation));
            toast.success("Update group settings successfully");
        }
        setLoading(false);
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
                                checked={
                                    newSettings.allow_member_to_change_group_info
                                }
                                onChange={handleCheckboxChange}
                                name="allow_member_to_change_group_info"
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
                                checked={
                                    newSettings.allow_member_to_invite_member
                                }
                                onChange={handleCheckboxChange}
                                name="allow_member_to_invite_member"
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
                                checked={
                                    newSettings.allow_member_to_pin_message
                                }
                                onChange={handleCheckboxChange}
                                name="allow_member_to_pin_message"
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
                                Change group name & avatar
                            </Typography>
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                className="ml-auto"
                                checked={
                                    newSettings.allow_deputy_change_group_info
                                }
                                onChange={handleCheckboxChange}
                                name="allow_deputy_change_group_info"
                            />
                        </Box>
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
                                checked={newSettings.allow_deputy_send_messages}
                                onChange={handleCheckboxChange}
                                name="allow_deputy_send_messages"
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
                                checked={
                                    newSettings.allow_deputy_to_invite_member
                                }
                                onChange={handleCheckboxChange}
                                name="allow_deputy_to_invite_member"
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
                                checked={newSettings.allow_deputy_remove_member}
                                onChange={handleCheckboxChange}
                                name="allow_deputy_remove_member"
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
                                checked={
                                    newSettings.allow_deputy_promote_member
                                }
                                onChange={handleCheckboxChange}
                                name="allow_deputy_promote_member"
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
                                checked={newSettings.allow_deputy_demote_member}
                                onChange={handleCheckboxChange}
                                name="allow_deputy_demote_member"
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
                                checked={newSettings.restricted_messaging}
                                onChange={handleCheckboxChange}
                                name="restricted_messaging"
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
                                checked={newSettings.join_by_link}
                                onChange={handleCheckboxChange}
                                name="join_by_link"
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
                                checked={newSettings.confirm_new_member}
                                onChange={handleCheckboxChange}
                                name="confirm_new_member"
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
                    onClick={onUpdateGroupSettings}
                >
                    {loading ? <LoadingSpinner /> : "Save"}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default SettingDialog;
