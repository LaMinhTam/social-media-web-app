import { CommentData, ReactionPostDetailResponse } from "@/types/postType";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import formatTime, {
    formatOnlineTime,
} from "@/utils/conversation/messages/handleGroupMessage";
import useHover from "@/hooks/useHover";
import ReactionPicker from "@/components/common/ReactionPicker";
import handleReactionClick from "@/utils/posts/handleReactionClick";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";
import { REACTION_TYPE } from "@/constants/global";
import { useDispatch, useSelector } from "react-redux";
import { handleGetCommentReactionDetail } from "@/services/post.service";
import { RootState } from "@/store/configureStore";
import ViewPostReactionDialog from "./ViewPostReactionDialog";
import { setReplyComment } from "@/store/actions/postSlice";

const PostComment = ({ data }: { data: CommentData }) => {
    const dispatch = useDispatch();
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const [openViewPostReactionDialog, setOpenViewPostReactionDialog] =
        useState(false);
    const [postReaction, setPostReaction] = useState<{
        [key: string]: number;
    }>(data.reactions ?? {});
    const [hoverRef, isHovered] = useHover();
    const [reactions, setReactions] =
        useState<ReactionPostDetailResponse | null>(null);
    const [currentReaction, setCurrentReaction] = useState<{
        name: string;
        emoji: string;
    } | null>(null);
    const [visibleComments, setVisibleComments] = useState<number>(2);

    const handleClick = () => {
        if (currentReaction) {
            handleReactionClick(
                {
                    name: currentReaction.name,
                    emoji: handleRenderReactionMessage(REACTION_TYPE.LIKE),
                },
                currentReaction,
                setCurrentReaction,
                postReaction,
                setPostReaction,
                reactions,
                setReactions,
                currentUserProfile,
                data.comment_id,
                "comment"
            );
        } else {
            handleReactionClick(
                {
                    name: REACTION_TYPE.LIKE,
                    emoji: handleRenderReactionMessage(REACTION_TYPE.LIKE),
                },
                currentReaction,
                setCurrentReaction,
                postReaction,
                setPostReaction,
                reactions,
                setReactions,
                currentUserProfile,
                data.comment_id,
                "comment"
            );
        }
    };

    const handleReplyComment = () => {
        dispatch(setReplyComment(data));
    };

    const handleLoadMoreComments = () => {
        setVisibleComments((prev) => prev + 2);
    };

    const fetchPostReactions = useCallback(async () => {
        const response = await handleGetCommentReactionDetail(data.comment_id);
        if (response) {
            const reaction = Object.keys(response).find((key) => {
                const isExist = response[key].some(
                    (item) => item.user_id === currentUserProfile.user_id
                );
                if (isExist) {
                    return key;
                }
            });
            if (reaction) {
                setCurrentReaction({
                    name: reaction,
                    emoji: handleRenderReactionMessage(reaction),
                });
            }
            setReactions(response);
        }
    }, [currentUserProfile.user_id]);

    useEffect(() => {
        fetchPostReactions();
    }, [fetchPostReactions]);

    const handleCalculateTotalReaction = useMemo(() => {
        return Object.keys(postReaction).reduce((total, key) => {
            return total + postReaction[key];
        }, 0);
    }, [currentReaction]);

    if (!data) return null;

    const renderChildComments = (childComments: CommentData[]) => {
        return childComments
            .slice(0, visibleComments)
            .reverse()
            .map((childComment) => (
                <PostComment
                    key={childComment.comment_id}
                    data={childComment}
                ></PostComment>
            ));
    };

    return (
        <>
            <Box className="flex items-start mb-4">
                <Image
                    width={40}
                    height={40}
                    src={data.author.image_url}
                    className="object-cover w-10 h-10 rounded-full"
                    alt="avatar"
                ></Image>
                <Box className="flex-1">
                    <Box className="p-2 bg-gray-100 rounded-lg">
                        <Typography variant="body2" className="font-semibold">
                            {data.author.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            className="whitespace-pre-line"
                        >
                            {data.content}
                        </Typography>
                        {data?.media && data.media.length > 0 && (
                            <PhotoProvider>
                                <Box className="mt-2">
                                    {data.media.map((url, index) => (
                                        <PhotoView src={url} key={index}>
                                            <Image
                                                src={url}
                                                alt={`media-${index}`}
                                                width={100}
                                                height={100}
                                                className="object-cover rounded-lg"
                                            />
                                        </PhotoView>
                                    ))}
                                </Box>
                            </PhotoProvider>
                        )}
                    </Box>
                    <Box className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                        <Box
                            ref={hoverRef}
                            sx={{
                                position: "relative",
                            }}
                        >
                            {isHovered && (
                                <div className={`absolute bottom-0 pb-10`}>
                                    <ReactionPicker
                                        handleReactionClick={(reaction) =>
                                            handleReactionClick(
                                                reaction,
                                                currentReaction,
                                                setCurrentReaction,
                                                postReaction,
                                                setPostReaction,
                                                reactions,
                                                setReactions,
                                                currentUserProfile,
                                                data.comment_id,
                                                "comment"
                                            )
                                        }
                                    ></ReactionPicker>
                                </div>
                            )}
                            <IconButton onClick={handleClick}>
                                {currentReaction ? (
                                    <>
                                        <Typography>
                                            {currentReaction.emoji}
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <ThumbUpAltOutlinedIcon></ThumbUpAltOutlinedIcon>
                                    </>
                                )}
                            </IconButton>
                        </Box>
                        <IconButton size="small" onClick={handleReplyComment}>
                            <ReplyOutlinedIcon fontSize="small" />
                        </IconButton>
                        <Tooltip title={formatTime(data.create_at)}>
                            <Typography
                                variant="caption"
                                className="flex-shrink-0"
                            >
                                {formatOnlineTime(data.create_at)} ago
                            </Typography>
                        </Tooltip>
                        <Button
                            type="button"
                            variant="text"
                            color="inherit"
                            className="normal-case"
                            size="large"
                            onClick={() => setOpenViewPostReactionDialog(true)}
                        >
                            {postReaction &&
                                Object.keys(postReaction).length > 0 &&
                                Object.keys(postReaction).map((key, index) => {
                                    return (
                                        <Typography
                                            key={index}
                                            className="ml-2"
                                        >
                                            {handleRenderReactionMessage(key)}
                                        </Typography>
                                    );
                                })}
                            <Typography className="ml-2">
                                {handleCalculateTotalReaction !== 0 &&
                                    handleCalculateTotalReaction}
                            </Typography>
                        </Button>
                    </Box>
                    {data.child_comments && data.child_comments.length > 0 && (
                        <Box className="mt-2">
                            {renderChildComments(data.child_comments)}
                            {visibleComments < data.child_comments.length && (
                                <Button onClick={handleLoadMoreComments}>
                                    Load More
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
            {reactions && openViewPostReactionDialog && (
                <ViewPostReactionDialog
                    openViewPostReactionDialog={openViewPostReactionDialog}
                    setOpenViewPostReactionDialog={
                        setOpenViewPostReactionDialog
                    }
                    reactions={reactions}
                ></ViewPostReactionDialog>
            )}
        </>
    );
};

export default PostComment;
