import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setOpenCreatePostDialog,
    setPage,
    setTriggerFetchingPost,
} from "@/store/actions/postSlice";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PostDialogContent from "./PostDialogContent";
import TagPeopleDialogContent from "./TagPeopleDialogContent";
import { FriendRequestData } from "@/types/userType";
import { RootState } from "@/store/configureStore";
import { handleUploadFile } from "@/services/conversation.service";
import { handleCreatePost } from "@/services/post.service";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const CreatePostDialog = ({
    openCreatePostDialog,
}: {
    openCreatePostDialog: boolean;
}) => {
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const triggerFetchingPost = useSelector(
        (state: RootState) => state.post.triggerFetchingPost
    );
    const posts = useSelector((state: RootState) => state.post.posts);
    const page = useSelector((state: RootState) => state.post.page);
    const dispatch = useDispatch();
    const [openTagPeopleDialog, setOpenTagPeopleDialog] = React.useState(false);
    const [content, setContent] = React.useState("");
    const [listFiles, setListFiles] = React.useState<File[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const handleClose = () => {
        dispatch(setOpenCreatePostDialog(false));
    };
    const [taggedPersons, setTaggedPersons] = React.useState<
        FriendRequestData[]
    >([]);
    const handlePost = async () => {
        setLoading(true);
        let media: string[] = [];

        const uploadPromises = listFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
            );
            formData.append("public_id", file.name);
            formData.append(
                "folder",
                `user/${currentUserProfile.user_id}/posts`
            );
            return handleUploadFile(formData, dispatch);
        });

        const uploadedImages = await Promise.all(uploadPromises);
        media = uploadedImages;

        const data = {
            content,
            co_author: taggedPersons.map((person) => person.user_id),
            media,
        };

        const response = await handleCreatePost(data);
        if (response) {
            setContent("");
            listFiles.forEach((file) => URL.revokeObjectURL(file.name));
            setListFiles([]);
            setTaggedPersons([]);
            const currentSizeOfPage = Object.keys(posts).length / page;
            if (currentSizeOfPage === 5) {
                dispatch(setPage(page + 1));
            }
            dispatch(setTriggerFetchingPost(!triggerFetchingPost));
            handleClose();
        }

        setLoading(false);
    };

    return (
        <>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openCreatePostDialog}
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
                    {openTagPeopleDialog ? "Tag people" : "Create Post"}
                </DialogTitle>
                {openTagPeopleDialog ? (
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenTagPeopleDialog(false)}
                        sx={{
                            position: "absolute",
                            left: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <KeyboardBackspaceIcon />
                    </IconButton>
                ) : (
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
                )}
                <DialogContent
                    dividers
                    sx={{
                        width: {
                            xs: "300px",
                            md: "548px",
                        },
                        height: "100%",
                    }}
                >
                    {loading && (
                        <Backdrop
                            sx={{
                                color: "#fff",
                                zIndex: 50,
                            }}
                            open={loading}
                        >
                            <CircularProgress color="info" />
                        </Backdrop>
                    )}
                    {!loading && openTagPeopleDialog ? (
                        <TagPeopleDialogContent
                            selectedPersons={taggedPersons}
                            setSelectedPersons={setTaggedPersons}
                        ></TagPeopleDialogContent>
                    ) : (
                        <PostDialogContent
                            content={content}
                            setContent={setContent}
                            listFiles={listFiles}
                            setListFiles={setListFiles}
                            taggedPersons={taggedPersons}
                            setOpenTagPeopleDialog={setOpenTagPeopleDialog}
                        ></PostDialogContent>
                    )}
                </DialogContent>
                <DialogActions>
                    {openTagPeopleDialog ? (
                        <Button
                            autoFocus
                            variant="contained"
                            color="info"
                            fullWidth
                            onClick={() => setOpenTagPeopleDialog(false)}
                        >
                            Done
                        </Button>
                    ) : (
                        <Button
                            autoFocus
                            variant="contained"
                            color="info"
                            disabled={loading}
                            fullWidth
                            onClick={handlePost}
                        >
                            Post
                        </Button>
                    )}
                </DialogActions>
            </BootstrapDialog>
        </>
    );
};

export default CreatePostDialog;
