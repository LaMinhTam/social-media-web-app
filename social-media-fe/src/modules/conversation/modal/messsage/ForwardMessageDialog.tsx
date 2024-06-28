import {
    Box,
    Button,
    Checkbox,
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
import { handleShareMessage } from "@/services/conversation.service";
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
    messageId,
}: {
    openForwardDialog: boolean;
    setOpenForwardDialog: (open: boolean) => void;
    messageId: string;
}) => {
    const [checkedValues, setCheckedValues] = React.useState<{
        [key: string]: boolean;
    }>({});
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
    const handleForwardMessage = async () => {
        const listConversationId = Object.keys(checkedValues).filter(
            (key) => checkedValues[key]
        );
        const response = await handleShareMessage(
            messageId,
            listConversationId
        );
        if (response) {
            setOpenForwardDialog(false);
        }
    };
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
                <Box className="w-full h-full px-4 my-4">
                    <SearchInput
                        placeholder="Input name to search..."
                        inputProps={{ "aria-label": "Input name to search..." }}
                        onChange={() => {}}
                        value=""
                        className=""
                    ></SearchInput>
                </Box>
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
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                checked={
                                    checkedValues[item.conversation_id] || false
                                }
                                onChange={(e) => {
                                    setCheckedValues({
                                        ...checkedValues,
                                        [item.conversation_id]:
                                            e.target.checked,
                                    });
                                }}
                            />
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
                            <Checkbox
                                color="primary"
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                                checked={
                                    checkedValues[item.conversation_id] || false
                                }
                                onChange={(e) => {
                                    setCheckedValues({
                                        ...checkedValues,
                                        [item.conversation_id]:
                                            e.target.checked,
                                    });
                                }}
                            />
                        </div>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    onClick={handleForwardMessage}
                    variant="contained"
                    color="primary"
                >
                    Forward
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default ForwardMessageDialog;
