import {
    Box,
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
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
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
    const listConversation = useSelector(
        (state: RootState) => state.conversation.listConversation
    );
    const listPrivateConversation = listConversation.filter(
        (conversation) => conversation.type === "PRIVATE"
    );
    const listGroupConversation = listConversation.filter(
        (conversation) => conversation.type === "GROUP"
    );
    if (!listConversation) return null;
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
            <DialogContent
                dividers
                className="py-4 overflow-x-hidden overflow-y-auto"
            >
                <SearchInput
                    placeholder="Search for people and groups"
                    inputProps={{
                        "aria-label": "Search for people and groups",
                    }}
                    onClick={() => {}}
                    onChange={() => {}}
                    value=""
                    className="w-full h-full"
                ></SearchInput>
                <Box className="px-2 pt-5 pb-1">
                    <Typography className="text-lg font-bold">
                        Friends
                    </Typography>
                </Box>
                <Box>
                    {listPrivateConversation.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-2 gap-x-2 w-[468px] h-[56px]"
                        >
                            <div className="flex items-center justify-center gap-x-2">
                                <img
                                    src={item.image}
                                    alt="avatar"
                                    className="object-cover w-10 h-10 rounded-full"
                                />
                                <span>{item.name}</span>
                            </div>
                            <Button
                                type="button"
                                variant="contained"
                                color="inherit"
                                size="medium"
                                className="shadow-none bg-tertiary bg-opacity-10 text-tertiary hover:bg-opacity-30 hover:bg-tertiary hover:shadow-none"
                            >
                                <Typography>Send</Typography>
                            </Button>
                        </div>
                    ))}
                </Box>
                <Box className="px-2 pt-5 pb-1">
                    <Typography className="text-lg font-bold">
                        Groups
                    </Typography>
                </Box>
                <Box>
                    {listGroupConversation.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-2 gap-x-2 w-[468px] h-[56px]"
                        >
                            <div className="flex items-center justify-center gap-x-2">
                                <img
                                    src={item.image}
                                    alt="avatar"
                                    className="object-cover w-10 h-10 rounded-full"
                                />
                                <span>{item.name}</span>
                            </div>
                            <Button
                                type="button"
                                variant="contained"
                                color="inherit"
                                size="medium"
                                className="shadow-none bg-tertiary bg-opacity-10 text-tertiary hover:bg-opacity-30 hover:bg-tertiary hover:shadow-none"
                            >
                                <Typography>Send</Typography>
                            </Button>
                        </div>
                    ))}
                </Box>
            </DialogContent>
        </BootstrapDialog>
    );
};

export default ForwardMessageDialog;
