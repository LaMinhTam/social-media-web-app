import { Box, Button, Typography } from "@mui/material";
import React from "react";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ShareSharpIcon from "@mui/icons-material/ShareSharp";
import ReactionPicker from "@/components/common/ReactionPicker";
import { useDispatch } from "react-redux";
import {
    setOpenSharePostDialog,
    setPostShareId,
} from "@/store/actions/postSlice";
const Action = ({
    postId,
    hoverRef,
    isHovered,
    handleClick,
    handleReactionClick,
    currentReaction,
    onCommentClick,
}: {
    postId: string;
    hoverRef: React.RefObject<HTMLDivElement>;
    isHovered: boolean;
    handleClick: () => void;
    handleReactionClick: (reaction: { name: string; emoji: string }) => void;
    currentReaction: {
        name: string;
        emoji: string;
    } | null;
    onCommentClick: () => void;
}) => {
    const dispatch = useDispatch();
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mt: 1,
                position: "relative",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                }}
                ref={hoverRef}
            >
                {isHovered && (
                    <div className={`absolute bottom-0 pb-10`}>
                        <ReactionPicker
                            handleReactionClick={handleReactionClick}
                        ></ReactionPicker>
                    </div>
                )}
                <Button
                    type="button"
                    variant="text"
                    color="inherit"
                    className="normal-case gap-x-2"
                    fullWidth
                    onClick={handleClick}
                >
                    {currentReaction ? (
                        <>
                            <Typography>{currentReaction.emoji}</Typography>
                            <Typography className="normal-case">
                                {currentReaction.name}
                            </Typography>
                        </>
                    ) : (
                        <>
                            <ThumbUpOffAltIcon></ThumbUpOffAltIcon>
                            <Typography>Like</Typography>
                        </>
                    )}
                </Button>
            </Box>
            <Button
                type="button"
                variant="text"
                color="inherit"
                className="normal-case gap-x-2"
                fullWidth
                onClick={onCommentClick}
            >
                <ChatBubbleOutlineOutlinedIcon></ChatBubbleOutlineOutlinedIcon>
                <Typography>Comment</Typography>
            </Button>
            <Button
                type="button"
                variant="text"
                color="inherit"
                className="normal-case gap-x-2"
                fullWidth
                onClick={() => {
                    dispatch(setPostShareId(postId));
                    dispatch(setOpenSharePostDialog(true));
                }}
            >
                <ShareSharpIcon></ShareSharpIcon>
                <Typography>Share</Typography>
            </Button>
        </Box>
    );
};

export default Action;
