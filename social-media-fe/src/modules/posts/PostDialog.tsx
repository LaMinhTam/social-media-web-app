import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    styled,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommentData, PostData } from "@/types/postType";
import Post from "./Post";
import { setOpenPostDialog } from "@/store/actions/postSlice";
import { RootState } from "@/store/configureStore";
import useClickOutSide from "@/hooks/useClickOutSide";
import { handleUploadFile } from "@/services/conversation.service";
import {
    handleCreateComment,
    handleGetCommentOnPost,
} from "@/services/post.service";
import PostComment from "./PostComment";
import { SORT_STRATEGY } from "@/constants/global";
import PostDialogAction from "./PostDialogAction";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
    "& .MuiPaper-root": {
        width: "700px",
        maxWidth: "none",
        overflowX: "hidden",
    },
}));

const PostDialog = ({
    openPostDialog,
    post,
}: {
    openPostDialog: boolean;
    post: PostData;
}) => {
    const [commentLoading, setCommentLoading] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [content, setContent] = React.useState<string>("");
    const [listFiles, setListFiles] = React.useState<File[]>([]);
    const [page, setPage] = useState<number>(1);
    const [sortStrategy, setSortStrategy] = useState<string>(
        SORT_STRATEGY.NEWEST
    );
    const [hasMore, setHasMore] = useState<boolean>(true);
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const [postComment, setPostComment] = React.useState<CommentData[]>(
        [] as CommentData[]
    );
    const dispatch = useDispatch();
    let authors = "";
    if (post.authors.length > 2) {
        post.authors.forEach((author, index) => {
            if (index < 2) {
                authors += author.name + ", ";
            }
        });
        authors =
            authors.slice(0, -2) +
            " và " +
            (post.authors.length - 2) +
            " người khác";
    } else if (post.authors.length === 2) {
        authors = post.authors[0].name + " và " + post.authors[1].name;
    } else {
        authors = post.authors[0].name;
    }

    const {
        show: showEmojiPicker,
        setShow: setShowEmojiPicker,
        nodeRef: emojiPickerRef,
    } = useClickOutSide();

    const handleClose = () => {
        dispatch(setOpenPostDialog(false));
    };

    const handleChooseEmoji = (emoji: any) => {
        setContent((prev) => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [listImage, setListImage] = React.useState<string[]>([]);

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
        setListFiles((prevFiles: File[]) => [...prevFiles, ...files]);
        setListImage((prevImages) => [
            ...prevImages,
            ...files.map((file) => URL.createObjectURL(file)),
        ]);
    };

    const handleRemoveFile = (index: number) => {
        setListFiles((currentFiles) =>
            currentFiles.filter((_, i) => i !== index)
        );
        setListImage((currentImages) =>
            currentImages.filter((_, i) => i !== index)
        );
    };

    const onCreateComment = async () => {
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
            post_id: post.post_id,
            content,
            media,
        };

        const response = await handleCreateComment(data);
        if (response) {
            setContent("");
            listFiles.forEach((file) => URL.revokeObjectURL(file.name));
            setListFiles([]);
        }

        setLoading(false);
    };

    const fetchComments = useCallback(async () => {
        setCommentLoading(true);
        const response = await handleGetCommentOnPost(
            post.post_id,
            page,
            10,
            sortStrategy
        );
        if (response) {
            setPostComment((prevComments) => {
                const newComments = response.filter(
                    (newComment) =>
                        !prevComments.some(
                            (prevComment) =>
                                prevComment.comment_id === newComment.comment_id
                        )
                );
                setHasMore(newComments.length > 0);
                return [...prevComments, ...newComments];
            });
        } else {
            setHasMore(false);
        }
        setCommentLoading(false);
    }, [page, post.post_id, sortStrategy]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortStrategy(event.target.value);
        setPage(1);
        setPostComment([]);
    };

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openPostDialog}
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
                {authors}'s Post
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
            <DialogContent dividers className="w-[700px] h-full p-4">
                <Post data={post}></Post>
                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Comments
                    </Typography>
                    <Select
                        value={sortStrategy}
                        onChange={handleSortChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                    >
                        <MenuItem value={SORT_STRATEGY.NEWEST}>Newest</MenuItem>
                        <MenuItem value={SORT_STRATEGY.OLDEST}>Oldest</MenuItem>
                        <MenuItem value={SORT_STRATEGY.POPULAR}>
                            Popular
                        </MenuItem>
                    </Select>
                </Box>
                <Box sx={{ mt: 2 }}>
                    {postComment.map((comment, index) => (
                        <PostComment key={index} data={comment}></PostComment>
                    ))}
                </Box>
                {commentLoading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
                {!commentLoading && hasMore && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                        }}
                    >
                        <Button onClick={handleLoadMore}>Load More</Button>
                    </Box>
                )}
            </DialogContent>
            <PostDialogAction
                listImage={listImage}
                handleRemoveFile={handleRemoveFile}
                handleFileChange={handleFileChange}
                content={content}
                setContent={setContent}
                currentUserProfile={currentUserProfile}
                onCreateComment={onCreateComment}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                handleChooseEmoji={handleChooseEmoji}
                handleFileInputClick={handleFileInputClick}
                fileInputRef={fileInputRef}
                emojiPickerRef={emojiPickerRef}
                loading={loading}
            ></PostDialogAction>
        </BootstrapDialog>
    );
};

export default PostDialog;
