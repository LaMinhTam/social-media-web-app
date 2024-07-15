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

const Post = ({ data }: { data: PostData }) => {
    let authors = "";
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    if (data.authors.length > 2) {
        data.authors.forEach((author, index) => {
            if (index < 2) {
                authors += author.name + ", ";
            }
        });
        authors =
            authors.slice(0, -2) +
            " và " +
            (data.authors.length - 2) +
            " người khác";
    } else if (data.authors.length === 2) {
        authors = data.authors[0].name + " và " + data.authors[1].name;
    } else {
        authors = data.authors[0].name;
    }
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
        async function fetchPostReactions() {
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
                console.log("reaction ~ reaction:", reaction);
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
    }, []);

    const handleCalculateTotalReaction = useMemo(() => {
        return Object.keys(postReaction).reduce((total, key) => {
            return total + postReaction[key];
        }, 0);
    }, [currentReaction]);

    if (!data) return null;
    return (
        <>
            <Box className="w-full h-full p-4 mt-4 rounded-lg shadow-md bg-lite">
                <Header authors={authors} create_at={data.create_at}></Header>
                <div className="mt-4">
                    <Typography>{data.content}</Typography>
                </div>
                <Media media={data.media}></Media>
                <Information
                    postReaction={postReaction}
                    handleCalculateTotalReaction={handleCalculateTotalReaction}
                    handleRenderReactionMessage={handleRenderReactionMessage}
                    setOpenViewPostReactionDialog={
                        setOpenViewPostReactionDialog
                    }
                ></Information>
                <hr />
                <Action
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
