import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Tooltip,
    Typography,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import {
    handleFindGroupByLink,
    handleJoinGroupByLink,
} from "@/services/conversation.service";
import Image from "next/image";
import { ConversationResponse } from "@/types/conversationType";
import { useRouter } from "next/navigation";
import { setCurrentConversation } from "@/store/actions/conversationSlice";
import { useDispatch } from "react-redux";
import { setShowChatModal } from "@/store/actions/commonSlice";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const JoinGroupLinkDialog = ({
    groupInfo,
    openJoinGroupLinkDialog,
    setOpenJoinGroupLinkDialog,
}: {
    groupInfo: ConversationResponse;
    openJoinGroupLinkDialog: boolean;
    setOpenJoinGroupLinkDialog: (open: boolean) => void;
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [buttonText, setButtonText] = useState("Join" as string);
    const handleClose = () => {
        setOpenJoinGroupLinkDialog(false);
    };
    const onJoinGroupByLink = async () => {
        setLoading(true);
        const settings = groupInfo.settings;
        const group_id = settings.link_to_join_group;
        const response = await handleJoinGroupByLink(group_id ?? "");
        if (response) {
            if (settings.confirm_new_member) {
                setButtonText("Request Sent");
            } else {
                setButtonText("Joined");
                setOpenJoinGroupLinkDialog(false);
                dispatch(setCurrentConversation(groupInfo));
                dispatch(setShowChatModal(true));
            }
        }
        setLoading(false);
    };
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openJoinGroupLinkDialog}
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
                Join Group
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
                        <Typography variant="body1">Join Group</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        display="flex"
                        flexDirection="row"
                        justifyContent="start"
                        alignItems="center"
                        gap={2}
                    >
                        <Image
                            src={groupInfo.image}
                            alt="group-image"
                            width={100}
                            height={100}
                            className="object-cover w-[100px] h-[100px] rounded-full"
                        ></Image>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="start"
                            alignItems="start"
                            gap={1}
                        >
                            <Typography variant="h4">
                                {groupInfo.name}
                            </Typography>
                            <Typography variant="body1">Group</Typography>
                            <Box
                                display="flex"
                                flexDirection="row"
                                justifyContent="start"
                                alignItems="start"
                                gap={1}
                            >
                                {Object.keys(groupInfo.members).length > 0 &&
                                    Object.values(groupInfo.members).map(
                                        (member) => (
                                            <Tooltip
                                                title={member.name}
                                                key={member.user_id}
                                            >
                                                <Image
                                                    src={member.image_url}
                                                    alt="member-image"
                                                    width={20}
                                                    height={20}
                                                    className="object-cover w-5 h-5 rounded-full"
                                                ></Image>
                                            </Tooltip>
                                        )
                                    )}
                            </Box>
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
                    onClick={onJoinGroupByLink}
                >
                    {loading ? <LoadingSpinner /> : buttonText}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default JoinGroupLinkDialog;
