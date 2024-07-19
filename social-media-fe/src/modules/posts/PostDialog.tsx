import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    SelectChangeEvent,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommentData, PostData } from "@/types/postType";
import Post from "./Post";
import {
    setOpenPostDialog,
    setPosts,
    setReplyComment,
} from "@/store/actions/postSlice";
import { RootState } from "@/store/configureStore";
import useClickOutSide from "@/hooks/useClickOutSide";
import { handleUploadFile } from "@/services/conversation.service";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
    handleCreateComment,
    handleGetCommentOnPost,
} from "@/services/post.service";
import PostComment from "./PostComment";
import { SORT_STRATEGY } from "@/constants/global";
import PostDialogAction from "./PostDialogAction";
import { FriendRequestData } from "@/types/userType";
import TagPeopleDialogContent from "./TagPeopleDialogContent";
import CommentSort from "./comment/CommentSort";
import { v4 as uuidv4 } from "uuid";

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
    const [storedPostReaction, setStoredPostReaction] = useState<{
        [key: string]: number;
    }>({});
    const isMobile = useSelector((state: RootState) => state.common.isMobile);
    const [openTagPeopleDialog, setOpenTagPeopleDialog] = React.useState(false);
    const replyComment = useSelector(
        (state: RootState) => state.post.replyComment
    );
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
    const posts = useSelector((state: RootState) => state.post.posts);
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

    const handleClose = () => {
        dispatch(setOpenPostDialog(false));
        const newPosts = {
            ...posts,
            [post.post_id]: {
                ...post,
                reactions: storedPostReaction,
            },
        };
        dispatch(setPosts(newPosts));
    };

    const handleChooseEmoji = (emoji: any) => {
        setContent((prev) => prev + emoji.native);
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [listImage, setListImage] = React.useState<string[]>([]);
    const [taggedPersons, setTaggedPersons] = React.useState<
        FriendRequestData[]
    >([]);

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

        const data: {
            post_id: string;
            content: string;
            media: string[];
            tags: number[];
            parent_comment_id?: string;
        } = {
            post_id: post.post_id,
            content,
            media,
            tags: taggedPersons.map((person) => person.user_id),
        };

        if (replyComment.comment_id) {
            data.parent_comment_id = replyComment.comment_id;
        }

        const response = await handleCreateComment(data);
        if (response) {
            let newTaggedPersons = taggedPersons.map((person) => ({
                user_id: person.user_id,
                name: person.name,
                email: person.email,
                image_url: person.image_url,
                cover: "",
            }));
            const newComment: CommentData = {
                comment_id: response,
                content: content,
                media: media,
                author: currentUserProfile,
                tags: newTaggedPersons,
                create_at: Date.now(),
                update_at: Date.now(),
                child_comments: [],
                reactions: {},
            };
            setPostComment((prevComments) => {
                if (replyComment.comment_id) {
                    return prevComments.map((comment) => {
                        if (comment.comment_id === replyComment.comment_id) {
                            return {
                                ...comment,
                                child_comments: [
                                    ...(comment.child_comments || []),
                                    newComment,
                                ],
                            };
                        }
                        return comment;
                    });
                } else {
                    return [newComment, ...prevComments];
                }
            });

            setContent("");
            listFiles.forEach((file) => URL.revokeObjectURL(file.name));
            setListFiles([]);
            setListImage([]);
            dispatch(setReplyComment({} as CommentData));
            setTaggedPersons([]);
            setPage(1);
        }

        setLoading(false);
    };

    const fetchComments = useCallback(async () => {
        console.log("fetching comments");
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

    useEffect(() => {
        if (taggedPersons.length > 0) {
            setContent(
                (prev) =>
                    prev +
                    taggedPersons.map((person) => `@${person.name}`).join(" ")
            );
        }
    }, [taggedPersons]);

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openPostDialog}
            onBackdropClick={handleClose}
        >
            {openTagPeopleDialog ? (
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 2,
                        textAlign: "center",
                        fontWeight: 700,
                    }}
                    id="customized-dialog-title"
                >
                    Tag people
                </DialogTitle>
            ) : (
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
            )}
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
            {openTagPeopleDialog ? (
                <TagPeopleDialogContent
                    selectedPersons={taggedPersons}
                    setSelectedPersons={setTaggedPersons}
                ></TagPeopleDialogContent>
            ) : (
                <DialogContent
                    dividers
                    sx={{
                        width: {
                            xs: "324px",
                            md: "700px",
                        },
                        height: "100%",
                        padding: 4,
                    }}
                >
                    <Post
                        data={post}
                        setStoredPostReaction={setStoredPostReaction}
                        type={isMobile ? "responsive" : "post"}
                    ></Post>
                    <CommentSort
                        sortStrategy={sortStrategy}
                        handleSortChange={handleSortChange}
                    ></CommentSort>
                    <Box sx={{ mt: 2 }}>
                        {postComment.map((comment, index) => (
                            <MemoizedPostComment
                                key={uuidv4()}
                                data={comment}
                            ></MemoizedPostComment>
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
            )}
            {openTagPeopleDialog ? (
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        color="info"
                        fullWidth
                        onClick={() => setOpenTagPeopleDialog(false)}
                    >
                        Done
                    </Button>
                </DialogActions>
            ) : (
                <PostDialogAction
                    replyComment={replyComment}
                    listImage={listImage}
                    handleRemoveFile={handleRemoveFile}
                    handleFileChange={handleFileChange}
                    content={content}
                    setContent={setContent}
                    currentUserProfile={currentUserProfile}
                    onCreateComment={onCreateComment}
                    handleChooseEmoji={handleChooseEmoji}
                    handleFileInputClick={handleFileInputClick}
                    fileInputRef={fileInputRef}
                    loading={loading}
                    setOpenTagPeopleDialog={setOpenTagPeopleDialog}
                ></PostDialogAction>
            )}
        </BootstrapDialog>
    );
};

const MemoizedPostComment = React.memo(({ data }: { data: CommentData }) => (
    <PostComment key={data.comment_id} data={data}></PostComment>
));

export default PostDialog;
