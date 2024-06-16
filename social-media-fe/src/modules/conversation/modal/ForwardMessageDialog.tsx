import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import SearchInput from "@/components/common/SearchInput";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const ForwardMessageDialog = ({
    openForwardDialog,
    setOpenForwardDialog,
    onForwardMessage,
}: {
    openForwardDialog: boolean;
    setOpenForwardDialog: (open: boolean) => void;
    onForwardMessage: () => void;
}) => {
    const handleClose = () => {
        setOpenForwardDialog(false);
    };
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openForwardDialog}
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
                Forward
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
            <DialogContent dividers className="w-[548px]">
                <SearchInput
                    placeholder="Search for people and groups"
                    inputProps={{
                        "aria-label": "Search for people and groups",
                    }}
                    onClick={() => {}}
                    onChange={() => {}}
                    value=""
                    className="w-full"
                ></SearchInput>
                {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="flex items-center py-2 gap-x-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                            <Typography className="font-semibold">
                                User Name
                            </Typography>
                            <Typography className="text-sm text-gray-500">
                                User email
                            </Typography>
                        </div>
                    </div>
                ))}
            </DialogContent>
        </BootstrapDialog>
    );
};

export default ForwardMessageDialog;
