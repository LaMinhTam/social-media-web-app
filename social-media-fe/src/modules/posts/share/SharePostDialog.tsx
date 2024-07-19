import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Popover,
    styled,
    TextareaAutosize,
    Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect } from "react";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import useClickOutSide from "@/hooks/useClickOutSide";
import {
    setOpenSharePostDialog,
    setPage,
    setPostShareId,
    setTriggerFetchingPost,
} from "@/store/actions/postSlice";
import { handleSharePost } from "@/services/post.service";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
const SharePostDialog = ({
    openSharePostDialog,
}: {
    openSharePostDialog: boolean;
}) => {
    const posts = useSelector((state: RootState) => state.post.posts);
    const page = useSelector((state: RootState) => state.post.page);
    const postShareId = useSelector(
        (state: RootState) => state.post.postShareId
    );
    const triggerFetchingPost = useSelector(
        (state: RootState) => state.post.triggerFetchingPost
    );
    const dispatch = useDispatch();
    const [content, setContent] = React.useState("");
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleChooseEmoji = (emoji: any) => {
        setContent((prev) => prev + emoji.native);
    };
    const handleClose = () => {
        dispatch(setOpenSharePostDialog(false));
    };
    const handlePost = async () => {
        setLoading(true);
        const response = await handleSharePost(postShareId, content);
        if (response) {
            dispatch(setPostShareId(""));
            setContent("");
            const currentSizeOfPage = Object.keys(posts).length / page;
            if (currentSizeOfPage === 5) {
                dispatch(setPage(page + 1));
            }
            dispatch(setTriggerFetchingPost(!triggerFetchingPost));
            dispatch(setOpenSharePostDialog(false));
        }
        setLoading(false);
    };

    return (
        <>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openSharePostDialog}
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
                    Share
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
                    {!loading && (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                position: "relative",
                            }}
                        >
                            <TextareaAutosize
                                aria-label={`Say something about this...`}
                                minRows={3}
                                placeholder={`Say something about this...`}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-2 pr-8 border-none outline-none resize-none"
                            />
                            <PopupState
                                variant="popover"
                                popupId="emoji-popup-popover-mobile"
                            >
                                {(popupState) => (
                                    <>
                                        <Tooltip
                                            title="Emoji"
                                            {...bindTrigger(popupState)}
                                        >
                                            <IconButton
                                                size="small"
                                                color={"inherit"}
                                                className="absolute right-0 transform -translate-y-1/2 top-1/2 btn-chat-action w-7 h-7"
                                            >
                                                <SentimentVerySatisfiedIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Popover
                                            {...bindPopover(popupState)}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "left",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "left",
                                            }}
                                        >
                                            <Picker
                                                data={data}
                                                onEmojiSelect={
                                                    handleChooseEmoji
                                                }
                                            />
                                        </Popover>
                                    </>
                                )}
                            </PopupState>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
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
                </DialogActions>
            </BootstrapDialog>
        </>
    );
};

export default SharePostDialog;
