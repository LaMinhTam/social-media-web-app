import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    styled,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import React, { useRef, useState } from "react";
import SearchInput from "@/components/common/SearchInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import sortedPersonToAlphabet from "@/utils/conversation/messages/sortedPersonToAlphabet";
import { v4 as uuidv4 } from "uuid";
import axios from "@/apis/axios";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { handleCreateConversation } from "@/services/conversation.service";
import {
    setListConversation,
    setTriggerFetchingConversation,
} from "@/store/actions/conversationSlice";
import { setTriggerReFetchingRelationship } from "@/store/actions/commonSlice";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const CreateGroupDialog = ({
    openCreateGroupDialog,
    setOpenCreateGroupDialog,
}: {
    openCreateGroupDialog: boolean;
    setOpenCreateGroupDialog: (open: boolean) => void;
}) => {
    const dispatch = useDispatch();
    const triggerFetchingConversation = useSelector(
        (state: RootState) => state.conversation.triggerFetchingConversation
    );
    const [name, setName] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [checkedValues, setCheckedValues] = useState<{
        [key: string]: boolean;
    }>({});
    console.log("checkedValues:", checkedValues);
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        if (!files.length) return;
        files.forEach(async (file) => {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
            );
            formData.append("public_id", file.name); // Set the name of the file
            formData.append("folder", `conversation/common/avatar`);

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                    formData
                );
                const imageUrl = response.data.secure_url;
                if (imageUrl) {
                    setImageUrl(imageUrl);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                console.error("Error uploading file:", error);
            }
        });
    };
    const handleClose = () => {
        setOpenCreateGroupDialog(false);
    };
    const relationshipUsers = useSelector(
        (state: RootState) => state.user.relationshipUsers
    );

    const sortedUsers = sortedPersonToAlphabet(
        Object.values(relationshipUsers.friends)
    );

    const handleCreateGroup = async () => {
        const selectedUsers = Object.keys(checkedValues)
            .filter((key) => checkedValues[key])
            .map((item) => Number(item));
        if (selectedUsers.length >= 2) {
            const response = await handleCreateConversation(
                "GROUP",
                selectedUsers,
                name,
                imageUrl
            );
            if (response) {
                dispatch(
                    setTriggerFetchingConversation(!triggerFetchingConversation)
                );
                handleClose();
            }
        }
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openCreateGroupDialog}
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
                Create Group
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
                <Box className="w-full h-[56px] flex items-center justify-start gap-x-2">
                    {loading && !imageUrl && <LoadingSpinner></LoadingSpinner>}
                    {!loading && imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="avatar"
                            className="w-8 h-8 rounded-full"
                            onClick={handleFileInputClick}
                        />
                    ) : (
                        <IconButton
                            size="small"
                            color="primary"
                            aria-label="Choose file"
                            className="btn-chat-action"
                            onClick={handleFileInputClick}
                        >
                            <CameraAltIcon />
                        </IconButton>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple={false}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <TextField
                        id="standard-basic"
                        label="Group name"
                        variant="standard"
                        className="flex-1 w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Box>
                <Box className="w-full h-full px-4 my-4">
                    <SearchInput
                        placeholder="Input name to search..."
                        inputProps={{ "aria-label": "Input name to search..." }}
                        onChange={() => {}}
                        value=""
                        className=""
                    ></SearchInput>
                </Box>
                <hr />
                {sortedUsers?.map((group) => (
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
                                    <img
                                        src={friend.image_url}
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
                    onClick={handleCreateGroup}
                    variant="contained"
                    color="info"
                >
                    Create
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default CreateGroupDialog;
