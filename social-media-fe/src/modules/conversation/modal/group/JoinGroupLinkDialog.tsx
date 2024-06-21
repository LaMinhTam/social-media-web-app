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
import { handleFindGroupByLink } from "@/services/conversation.service";
import Image from "next/image";
import { ConversationResponse } from "@/types/conversationType";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const JoinGroupLinkDialog = ({
    openJoinGroupLinkDialog,
    setOpenJoinGroupLinkDialog,
}: {
    openJoinGroupLinkDialog: boolean;
    setOpenJoinGroupLinkDialog: (open: boolean) => void;
}) => {
    const [loading, setLoading] = useState(false);
    const [groupInfo, setGroupInfo] = useState<ConversationResponse>(
        {} as ConversationResponse
    );
    const handleClose = () => {
        setOpenJoinGroupLinkDialog(false);
    };
    useEffect(() => {
        async function findGroupByLink() {
            setLoading(true);
            const response = await handleFindGroupByLink(
                "f616b953-1e08-4cd4-8df9-43590fcaf5e6"
            );
            console.log("response:", response);
            if (response) {
                setGroupInfo(response);
            }
            setLoading(false);
        }
        if (openJoinGroupLinkDialog) {
            findGroupByLink();
        }
    }, []);
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
                <Button autoFocus variant="contained" color="info">
                    Join
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default JoinGroupLinkDialog;
