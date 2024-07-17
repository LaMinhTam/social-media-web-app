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
import React, { MutableRefObject } from "react";
import SearchInput from "@/components/common/SearchInput";
import { ConversationResponse } from "@/types/conversationType";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import sortedPersonToAlphabet from "@/utils/conversation/messages/sortedPersonToAlphabet";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { handleAddMember } from "@/services/conversation.service";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const AddMemberDialog = ({
    currentConversation,
    openAddMemberDialog,
    setOpenAddMemberDialog,
}: {
    currentConversation: ConversationResponse;
    openAddMemberDialog: boolean;
    setOpenAddMemberDialog: (open: boolean) => void;
}) => {
    const [checkedValues, setCheckedValues] = React.useState<{
        [key: string]: boolean;
    }>({});
    const [loading, setLoading] = React.useState(false);
    const relationshipUser = useSelector(
        (state: RootState) => state.user.relationshipUsers
    );
    const sortedUser = sortedPersonToAlphabet(
        Object.values(relationshipUser.friends || {})
    );
    const handleClose = () => {
        setOpenAddMemberDialog(false);
    };
    const onAddMember = async () => {
        setLoading(true);
        const selectedUser = Object.keys(checkedValues)
            .filter((key) => checkedValues[key])
            .map((key) => parseInt(key));
        const selectedUserString = selectedUser.join(",");
        const response = await handleAddMember(
            currentConversation.conversation_id,
            selectedUserString
        );
        if (response) {
            setOpenAddMemberDialog(false);
        }
        setLoading(false);
    };
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openAddMemberDialog}
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
                Add new member
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
                <Box className="w-full h-full px-4 my-4">
                    <SearchInput
                        placeholder="Search..."
                        inputProps={{ "aria-label": "Search..." }}
                        onChange={() => {}}
                        value=""
                        className=""
                    ></SearchInput>
                </Box>
                <hr />
                {sortedUser?.map((group) => (
                    <Box
                        key={uuidv4()}
                        className="flex flex-col w-full h-full gap-y-2"
                    >
                        <Typography>{group.key.toUpperCase()}</Typography>
                        {group.data.map((friend) => (
                            <Box
                                key={uuidv4()}
                                className="flex items-center justify-between"
                            >
                                <Box className="flex items-center justify-start gap-x-2">
                                    <Image
                                        src={friend.image_url}
                                        width={32}
                                        height={32}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <Typography>{friend.name}</Typography>
                                </Box>
                                <Checkbox
                                    color="primary"
                                    inputProps={{
                                        "aria-label": "select all desserts",
                                    }}
                                    checked={
                                        checkedValues[friend.user_id] || false
                                    }
                                    onChange={(e) => {
                                        setCheckedValues({
                                            ...checkedValues,
                                            [friend.user_id]: e.target.checked,
                                        });
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                ))}
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
                    onClick={onAddMember}
                >
                    {loading ? <LoadingSpinner /> : "Save"}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default AddMemberDialog;
