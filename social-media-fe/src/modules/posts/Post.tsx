import { Box, Typography } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { PostData, ReactionPostDetailResponse } from "@/types/postType";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";
import { REACTION_TYPE } from "@/constants/global";
import useHover from "@/hooks/useHover";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import { handleGetPostReactionDetail } from "@/services/post.service";
import ViewPostReactionDialog from "./ViewPostReactionDialog";
import Header from "./Header";
import Media from "./Media";
import Information from "./Information";
import Action from "./Action";
import handleReactionClick from "@/utils/posts/handleReactionClick";
import {
    setCurrentPostData,
    setOpenPostDialog,
} from "@/store/actions/postSlice";
import handleRenderAuthor from "@/utils/posts/handleRenderAuthor";

const Post = ({
    data,
    setStoredPostReaction,
}: {
    data: PostData;
    setStoredPostReaction?: React.Dispatch<
        React.SetStateAction<{
            [key: string]: number;
        }>
    >;
}) => {
    let authors = handleRenderAuthor(data.authors);
    let shareAuthors = handleRenderAuthor(data.share_post?.authors ?? []);
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );

    const dispatch = useDispatch();
    const openPostDialog = useSelector(
        (state: RootState) => state.post.openPostDialog
    );
    const [openViewPostReactionDialog, setOpenViewPostReactionDialog] =
        React.useState(false);
    const [postReaction, setPostReaction] = React.useState<{
        [key: string]: number;
    }>(data.reactions ?? {});
    const [hoverRef, isHovered] = useHover();
    const [reactions, setReactions] =
        React.useState<ReactionPostDetailResponse | null>(null);
    const [currentReaction, setCurrentReaction] = React.useState<{
        name: string;
        emoji: string;
    } | null>(null);
    const [triggerFetchReaction, setTriggerFetchReaction] =
        React.useState(false);
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
                data.post_id
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
                data.post_id
            );
        }
    };

    useEffect(() => {
        if (data.reactions) {
            setPostReaction(data.reactions);
            setTriggerFetchReaction(!triggerFetchReaction);
        }
    }, [data]);

    useEffect(() => {
        async function fetchPostReactions() {
            console.log("Run fetchPostReactions");
            const response = await handleGetPostReactionDetail(data.post_id);
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
        }
        fetchPostReactions();
    }, [triggerFetchReaction]);

    const handleCalculateTotalReaction = useMemo(() => {
        return Object.keys(postReaction).reduce((total, key) => {
            return total + postReaction[key];
        }, 0);
    }, [postReaction]);

    useEffect(() => {
        if (setStoredPostReaction) {
            setStoredPostReaction(postReaction);
        }
    }, [postReaction]);

    if (!data) return null;
    return (
        <>
            <Box className="w-full h-full p-4 mt-4 rounded-lg shadow-md bg-lite">
                <Header authors={authors} create_at={data.create_at}></Header>
                <div className="mt-4">
                    <Typography>{data.content}</Typography>
                </div>
                {data.media && data.media.length > 0 && (
                    <Media media={data.media}></Media>
                )}
                {data.share_post && (
                    <Box
                        sx={{
                            border: "2px solid #ccc",
                            borderRadius: "10px",
                            padding: "10px",
                            marginTop: "10px",
                        }}
                    >
                        <Header
                            authors={shareAuthors}
                            create_at={data.share_post.create_at}
                        ></Header>
                        <div className="mt-4">
                            <Typography>{data.share_post.content}</Typography>
                        </div>
                        {data.share_post.media &&
                            data.share_post.media.length > 0 && (
                                <Media media={data.share_post.media}></Media>
                            )}
                    </Box>
                )}
                <Information
                    postReaction={postReaction}
                    handleCalculateTotalReaction={handleCalculateTotalReaction}
                    handleRenderReactionMessage={handleRenderReactionMessage}
                    setOpenViewPostReactionDialog={
                        setOpenViewPostReactionDialog
                    }
                    onCommentClick={() => {
                        if (!openPostDialog) {
                            dispatch(setOpenPostDialog(true));
                            dispatch(
                                setCurrentPostData({
                                    ...data,
                                    reactions: postReaction,
                                })
                            );
                        }
                    }}
                ></Information>
                <hr />
                <Action
                    postId={data.post_id}
                    hoverRef={hoverRef}
                    isHovered={isHovered}
                    handleClick={handleClick}
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
                            data.post_id
                        )
                    }
                    currentReaction={currentReaction}
                    onCommentClick={() => {
                        if (!openPostDialog) {
                            dispatch(setOpenPostDialog(true));
                            dispatch(
                                setCurrentPostData({
                                    ...data,
                                    reactions: postReaction,
                                })
                            );
                        }
                    }}
                ></Action>
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

export default Post;
