import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import GroupMemberDialog from "./GroupMemberDialog";
import AddMemberDialog from "./AddMemberDialog";
import ConfirmActionDialog from "./ConfirmActionDialog";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import {
    handleDisbandGroup,
    handleGetListPendingMembers,
    handleLeaveGroup,
} from "@/services/conversation.service";
import { setShowChatModal } from "@/store/actions/commonSlice";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "@/constants/firebaseConfig";
import CopyToClipboard from "react-copy-to-clipboard";
import isConversationDeputy from "@/utils/conversation/messages/isConversationDeputy";
import { setListPendingUsers } from "@/store/actions/conversationSlice";

const GroupSetting = ({
    popupState,
    isAdmin,
}: {
    popupState: PopupState;
    isAdmin: boolean;
}) => {
    const dispatch = useDispatch();
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const listPendingUsers = useSelector(
        (state: RootState) => state.conversation.listPendingUsers
    );
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
    const onDisbandGroup = async () => {
        const response = await handleDisbandGroup(
            currentConversation.conversation_id
        );
        if (response) {
            // find the document in unread message and delete it in firestore
            const unreadTrackRef = collection(db, "unreadTrack");
            const q = query(
                unreadTrackRef,
                where(
                    "conversation_id",
                    "==",
                    currentConversation.conversation_id
                )
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                deleteDoc(doc(db, "unreadTrack", snapshot.docs[0].id));
            }

            toast.success("Disband group successfully");
            dispatch(setShowChatModal(false));
            popupState.close();
        }
    };
    const onLeaveGroup = async () => {
        if (currentUserProfile.user_id === currentConversation.owner_id) {
            toast.error(
                "You must transfer the ownership to another member before leaving the group"
            );
            return;
        } else {
            const response = await handleLeaveGroup(
                currentConversation.conversation_id
            );
            if (response) {
                toast.success("You are leaving the group");
                dispatch(setShowChatModal(false));
                popupState.close();
            }
        }
    };

    const handleOpenMemberDialog = async () => {
        const response = await handleGetListPendingMembers(
            currentConversation.conversation_id
        );
        if (response) {
            setOpenGroupMemberDialog(true);
            dispatch(setListPendingUsers(response));
        }
    };

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
                                    isConversationDeputy(
                                        currentUserProfile.user_id,
                                        currentConversation
                                    ) &&
                                    settings.allow_deputy_change_group_info
                                ) {
                                    setOpenChangeGroupNameDialog(true);
                                } else if (
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
                                    isConversationDeputy(
                                        currentUserProfile.user_id,
                                        currentConversation
                                    ) &&
                                    settings.allow_deputy_change_group_info
                                ) {
                                    setOpenChangeAvatarDialog(true);
                                } else if (
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
                        onClick={handleOpenMemberDialog}
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
                                if (
                                    isConversationDeputy(
                                        currentUserProfile.user_id,
                                        currentConversation
                                    ) &&
                                    settings.allow_deputy_to_invite_member
                                ) {
                                    setOpenAddMemberDialog(true);
                                } else {
                                    if (
                                        settings.allow_member_to_invite_member
                                    ) {
                                        setOpenAddMemberDialog(true);
                                    } else {
                                        toast.error(
                                            "You don't have permission to add member"
                                        );
                                    }
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
                <Stack>
                    <Box sx={{ width: "100%", py: 2 }}>
                        <Typography className="mb-2 font-bold">
                            Link join group
                        </Typography>
                        <div className="flex items-center justify-between bg-secondary bg-opacity-10 px-3 h-[40px] rounded text-secondary">
                            <span>
                                {
                                    currentConversation.settings
                                        .link_to_join_group
                                }
                            </span>
                            <CopyToClipboard
                                text={
                                    `${window.location.origin}/join/group?groupId=` +
                                    currentConversation.settings
                                        .link_to_join_group
                                }
                            >
                                <IconButton
                                    size="small"
                                    color="inherit"
                                    aria-label="copy"
                                >
                                    <ContentCopyIcon />
                                </IconButton>
                            </CopyToClipboard>
                        </div>
                    </Box>
                </Stack>
            </div>
            {openSettingDialog && (
                <SettingDialog
                    popupState={popupState}
                    conversationId={currentConversation.conversation_id}
                    openSettingDialog={openSettingDialog}
                    setOpenSettingDialog={setOpenSettingDialog}
                    settings={settings}
                ></SettingDialog>
            )}
            {openChangeGroupNameDialog && (
                <ChangeGroupNameDialog
                    popupState={popupState}
                    conversationId={currentConversation.conversation_id}
                    currentGroupName={currentConversation?.name || ""}
                    openChangeGroupNameDialog={openChangeGroupNameDialog}
                    setOpenChangeGroupNameDialog={setOpenChangeGroupNameDialog}
                ></ChangeGroupNameDialog>
            )}
            {openChangeAvatarDialog && (
                <ChangeAvatarDialog
                    popupState={popupState}
                    conversationId={currentConversation.conversation_id}
                    openChangeAvatarDialog={openChangeAvatarDialog}
                    setOpenChangeAvatarDialog={setOpenChangeAvatarDialog}
                    currentAvatar={currentConversation?.image || ""}
                ></ChangeAvatarDialog>
            )}
            {openGroupMemberDialog && (
                <GroupMemberDialog
                    currentUserId={currentUserProfile.user_id}
                    currentConversation={currentConversation}
                    openGroupMemberDialog={openGroupMemberDialog}
                    setOpenGroupMemberDialog={setOpenGroupMemberDialog}
                    listPendingUsers={listPendingUsers}
                ></GroupMemberDialog>
            )}
            {openAddMemberDialog && (
                <AddMemberDialog
                    currentConversation={currentConversation}
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
                    onClick={onLeaveGroup}
                ></ConfirmActionDialog>
            )}
            {openDisbandGroupConfirm && (
                <ConfirmActionDialog
                    open={openDisbandGroupConfirm}
                    setOpen={setOpenDisbandGroupConfirm}
                    title="Disband group"
                    content="Are you sure you want to disband this group?"
                    buttonContent="Disband"
                    onClick={onDisbandGroup}
                ></ConfirmActionDialog>
            )}
        </>
    );
};

export default GroupSetting;
