import { Button, Popover, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoIcon from "@mui/icons-material/Photo";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BlockIcon from "@mui/icons-material/Block";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React from "react";
import { PopupState } from "material-ui-popup-state/hooks";
import SettingDialog from "./SettingDialog";
import ChangeGroupNameDialog from "./ChangeGroupNameDialog";
import ChangeAvatarDialog from "./ChangeGroupAvatarDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import GroupMemberDialog from "./GroupMemberDialog";
import AddMemberDialog from "./AddMemberDialog";
import ConfirmActionDialog from "./ConfirmActionDialog";
import { toast } from "react-toastify";

const GroupSetting = ({
    popupState,
    isAdmin,
}: {
    popupState: PopupState;
    isAdmin: boolean;
}) => {
    const currentConversation = useSelector(
        (state: RootState) => state.conversation.currentConversation
    );
    const settings = currentConversation.settings;
    const [openSettingDialog, setOpenSettingDialog] = React.useState(false);
    const [openChangeGroupNameDialog, setOpenChangeGroupNameDialog] =
        React.useState(false);

    const [openChangeAvatarDialog, setOpenChangeAvatarDialog] =
        React.useState(false);
    const [openGroupMemberDialog, setOpenGroupMemberDialog] =
        React.useState(false);
    const [openAddMemberDialog, setOpenAddMemberDialog] = React.useState(false);
    const [openLeaveGroupConfirm, setOpenLeaveGroupConfirm] =
        React.useState(false);
    const [openDisbandGroupConfirm, setOpenDisbandGroupConfirm] =
        React.useState(false);

    return (
        <>
            <div className="w-[344px] h-[385px] py-2 px-2">
                <Stack className="flex flex-col items-start justify-center">
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        className="flex items-center justify-start normal-case gap-x-1"
                        onClick={() => {
                            if (!isAdmin) {
                                if (
                                    settings.allow_member_to_change_group_info
                                ) {
                                    setOpenChangeGroupNameDialog(true);
                                } else {
                                    toast.error(
                                        "You don't have permission to change group name"
                                    );
                                }
                            } else {
                                setOpenChangeGroupNameDialog(true);
                            }
                        }}
                    >
                        <EditIcon />
                        <Typography>Conversation name</Typography>
                    </Button>
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        className="flex items-center justify-start normal-case gap-x-1"
                        onClick={() => {
                            if (!isAdmin) {
                                if (
                                    settings.allow_member_to_change_group_info
                                ) {
                                    setOpenChangeAvatarDialog(true);
                                } else {
                                    toast.error(
                                        "You don't have permission to change group avatar"
                                    );
                                }
                            } else {
                                setOpenChangeAvatarDialog(true);
                            }
                        }}
                    >
                        <PhotoIcon />
                        <Typography>Change photo</Typography>
                    </Button>
                </Stack>
                <hr className="my-2" />
                <Stack>
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        className="flex items-center justify-start normal-case gap-x-1"
                        onClick={() => setOpenGroupMemberDialog(true)}
                    >
                        <GroupsIcon />
                        <Typography>Members</Typography>
                    </Button>
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        className="flex items-center justify-start normal-case gap-x-1"
                        onClick={() => {
                            if (!isAdmin) {
                                if (settings.allow_member_to_invite_member) {
                                    setOpenAddMemberDialog(true);
                                } else {
                                    toast.error(
                                        "You don't have permission to add member"
                                    );
                                }
                            } else {
                                setOpenAddMemberDialog(true);
                            }
                        }}
                    >
                        <PersonAddAltIcon />
                        <Typography>Add people</Typography>
                    </Button>
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        className="flex items-center justify-start normal-case gap-x-1"
                        onClick={() => setOpenLeaveGroupConfirm(true)}
                    >
                        <ExitToAppIcon />
                        <Typography>Leave group</Typography>
                    </Button>
                </Stack>
                <hr className="my-2" />
                <Stack>
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        className="flex items-center justify-start normal-case gap-x-1"
                    >
                        <NotificationsIcon />
                        <Typography>Mute Notification</Typography>
                    </Button>
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        className="flex items-center justify-start normal-case gap-x-1"
                    >
                        <BlockIcon />
                        <Typography>Block a member</Typography>
                    </Button>
                    {isAdmin && (
                        <>
                            <Button
                                variant="text"
                                color="inherit"
                                fullWidth
                                className="flex items-center justify-start normal-case gap-x-1"
                                onClick={() => setOpenSettingDialog(true)}
                            >
                                <SettingsIcon />
                                <Typography>Settings</Typography>
                            </Button>
                            <Button
                                variant="text"
                                color="inherit"
                                fullWidth
                                className="flex items-center justify-start normal-case gap-x-1"
                                onClick={() => setOpenDisbandGroupConfirm(true)}
                            >
                                <DeleteOutlineIcon />
                                <Typography>Disband group</Typography>
                            </Button>
                        </>
                    )}
                </Stack>
                <hr className="my-2" />
            </div>
            {openSettingDialog && (
                <SettingDialog
                    openSettingDialog={openSettingDialog}
                    setOpenSettingDialog={setOpenSettingDialog}
                    settings={settings}
                ></SettingDialog>
            )}
            {openChangeGroupNameDialog && (
                <ChangeGroupNameDialog
                    currentGroupName={currentConversation?.name || ""}
                    openChangeGroupNameDialog={openChangeGroupNameDialog}
                    setOpenChangeGroupNameDialog={setOpenChangeGroupNameDialog}
                ></ChangeGroupNameDialog>
            )}
            {openChangeAvatarDialog && (
                <ChangeAvatarDialog
                    openChangeAvatarDialog={openChangeAvatarDialog}
                    setOpenChangeAvatarDialog={setOpenChangeAvatarDialog}
                    currentAvatar={currentConversation?.image || ""}
                ></ChangeAvatarDialog>
            )}
            {openGroupMemberDialog && (
                <GroupMemberDialog
                    openGroupMemberDialog={openGroupMemberDialog}
                    setOpenGroupMemberDialog={setOpenGroupMemberDialog}
                ></GroupMemberDialog>
            )}
            {openAddMemberDialog && (
                <AddMemberDialog
                    openAddMemberDialog={openAddMemberDialog}
                    setOpenAddMemberDialog={setOpenAddMemberDialog}
                ></AddMemberDialog>
            )}

            {openLeaveGroupConfirm && (
                <ConfirmActionDialog
                    open={openLeaveGroupConfirm}
                    setOpen={setOpenLeaveGroupConfirm}
                    title="Leave group"
                    content="Are you sure you want to leave this group?"
                    buttonContent="Leave"
                ></ConfirmActionDialog>
            )}
            {openDisbandGroupConfirm && (
                <ConfirmActionDialog
                    open={openDisbandGroupConfirm}
                    setOpen={setOpenDisbandGroupConfirm}
                    title="Disband group"
                    content="Are you sure you want to disband this group?"
                    buttonContent="Disband"
                ></ConfirmActionDialog>
            )}
        </>
    );
};

export default GroupSetting;
