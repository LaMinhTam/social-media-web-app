import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    DialogActions,
    IconButton,
    TextareaAutosize,
    Tooltip,
    Typography,
} from "@mui/material";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { CommentData } from "@/types/postType";
import { setReplyComment } from "@/store/actions/postSlice";
import { useDispatch } from "react-redux";
const PostDialogAction = ({
    replyComment,
    listImage,
    handleRemoveFile,
    handleFileChange,
    content,
    setContent,
    currentUserProfile,
    onCreateComment,
    showEmojiPicker,
    setShowEmojiPicker,
    handleChooseEmoji,
    handleFileInputClick,
    fileInputRef,
    emojiPickerRef,
    loading,
    setOpenTagPeopleDialog,
}: {
    replyComment: CommentData;
    listImage: string[];
    handleRemoveFile: (index: number) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    content: string;
    setContent: (content: string) => void;
    currentUserProfile: any;
    onCreateComment: () => void;
    showEmojiPicker: boolean;
    setShowEmojiPicker: (showEmojiPicker: boolean) => void;
    handleChooseEmoji: (emoji: string) => void;
    handleFileInputClick: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    emojiPickerRef: React.RefObject<HTMLDivElement>;
    loading: boolean;
    setOpenTagPeopleDialog: (open: boolean) => void;
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (replyComment && replyComment.author) {
            setContent(`@${replyComment.author.name} `);
        }
    }, [replyComment]);

    const onEnterPress = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await onCreateComment();
        }
    };
    return (
        <DialogActions>
            {loading ? (
                <Backdrop
                    sx={{
                        color: "#fff",
                        zIndex: 50,
                    }}
                    open={loading}
                >
                    <CircularProgress color="info" />
                </Backdrop>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        width: "100%",
                        overflowX: "hidden",
                    }}
                >
                    {listImage.length > 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                                padding: "16px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                            }}
                        >
                            {listImage.map((file, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: "relative",
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Image
                                        src={file}
                                        alt={""}
                                        width={100}
                                        height={100}
                                        className="object-cover w-full h-full"
                                    />
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            color: "white",
                                        }}
                                        onClick={() => handleRemoveFile(index)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button variant="text" component="label">
                                <AddIcon />
                                <input
                                    type="file"
                                    accept="image/*, video/*"
                                    multiple
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Box>
                    )}
                    {replyComment && replyComment.author && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mt: 1,
                                position: "relative",
                                mb: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Image
                                        src={replyComment.author.image_url}
                                        alt={replyComment.author.name}
                                        width={40}
                                        height={40}
                                        className="object-cover w-10 h-10 rounded-full"
                                    ></Image>
                                    <Typography>
                                        {replyComment.author.name}
                                    </Typography>
                                </Box>
                                <Typography>{replyComment.content}</Typography>
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                    }}
                                    onClick={() => {
                                        dispatch(
                                            setReplyComment({} as CommentData)
                                        );
                                        setContent("");
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                    <TextareaAutosize
                        aria-label="empty textarea"
                        placeholder={`Comment as ${currentUserProfile.name}`}
                        minRows={2}
                        maxRows={12}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={onEnterPress}
                        className="w-full p-2 pb-10 border-none rounded-lg outline-none resize-none bg-strock h-full max-h-[400px]"
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            zIndex: 9999,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Tooltip title="Send Emoji">
                                    <IconButton
                                        size="small"
                                        color={"inherit"}
                                        className="btn-chat-action w-7 h-7"
                                        onClick={() =>
                                            setShowEmojiPicker(!showEmojiPicker)
                                        }
                                    >
                                        <SentimentVerySatisfiedIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Send file">
                                    <Box>
                                        <IconButton
                                            size="small"
                                            color={"inherit"}
                                            aria-label="Đính kèm file"
                                            className="btn-chat-action"
                                            onClick={handleFileInputClick}
                                        >
                                            <PhotoLibraryIcon />
                                        </IconButton>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            multiple
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                    </Box>
                                </Tooltip>
                                <Tooltip title="Tag people">
                                    <Box>
                                        <IconButton
                                            size="small"
                                            color={"inherit"}
                                            aria-label="Tag people"
                                            onClick={() =>
                                                setOpenTagPeopleDialog(true)
                                            }
                                        >
                                            <PersonAddIcon />
                                        </IconButton>
                                    </Box>
                                </Tooltip>
                            </Box>
                            <Tooltip
                                title="Press enter to send"
                                className="mr-6"
                            >
                                <IconButton
                                    size="small"
                                    color={"inherit"}
                                    aria-label="Thích"
                                    className="btn-chat-action"
                                    onClick={onCreateComment}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Tooltip>
                            {showEmojiPicker && (
                                <div
                                    className="absolute z-50 left-0-0 bottom-12"
                                    ref={emojiPickerRef}
                                >
                                    <Picker
                                        data={data}
                                        onEmojiSelect={handleChooseEmoji}
                                    />
                                </div>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}
        </DialogActions>
    );
};

export default PostDialogAction;
