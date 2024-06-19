import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Tab,
    Tabs,
    Typography,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, { useState } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const GroupMemberDialog = ({
    openGroupMemberDialog,
    setOpenGroupMemberDialog,
}: {
    openGroupMemberDialog: boolean;
    setOpenGroupMemberDialog: (open: boolean) => void;
}) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleClose = () => {
        setOpenGroupMemberDialog(false);
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openGroupMemberDialog}
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
                Members
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
                <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                        >
                            <Tab label="All" />
                            <Tab label="Admin" />
                        </Tabs>
                    </Box>
                    {value === 0 && (
                        <Box sx={{ p: 3 }}>
                            {Array.from({ length: 20 }).map((_, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <img
                                            src="https://source.unsplash.com/random"
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "50%",
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography className="font-bold">
                                            User {index + 1}
                                        </Typography>
                                        <Typography className="text-sm text-gray-500">
                                            Added by Admin
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        size="small"
                                        color="inherit"
                                        sx={{
                                            marginLeft: "auto",
                                        }}
                                    >
                                        <MoreHorizIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}
                    {value === 1 && (
                        <Box sx={{ p: 3 }}>
                            {Array.from({ length: 2 }).map((_, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <img
                                            src="https://source.unsplash.com/random"
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "50%",
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography className="font-bold">
                                            User {index + 1}
                                        </Typography>
                                        <Typography className="text-sm text-gray-500">
                                            Added by Admin
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        size="small"
                                        color="inherit"
                                        sx={{
                                            marginLeft: "auto",
                                        }}
                                    >
                                        <MoreHorizIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </DialogContent>
        </BootstrapDialog>
    );
};

export default GroupMemberDialog;
