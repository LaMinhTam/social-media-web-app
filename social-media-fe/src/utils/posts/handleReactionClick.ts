import {
    handleCreateReaction,
    handleReactionToComment,
} from "@/services/post.service";
import { Member } from "@/types/conversationType";

interface Reaction {
    name: string;
    emoji: string;
}

const handleReactionClick = async (
    reaction: Reaction,
    currentReaction: Reaction | null,
    setCurrentReaction: (value: Reaction | null) => void,
    postReaction: { [key: string]: number },
    setPostReaction: (value: { [key: string]: number }) => void,
    reactions: { [key: string]: any[] } | null,
    setReactions: (value: { [key: string]: any[] } | null) => void,
    currentUserProfile: Member,
    postId: string,
    type?: string
) => {
    if (currentReaction && currentReaction.name === reaction.name) {
        setCurrentReaction(null);

        if (postReaction && postReaction[reaction.name] > 0) {
            const updatedPostReaction = {
                ...postReaction,
                [reaction.name]: postReaction[reaction.name] - 1,
            };
            if (updatedPostReaction[reaction.name] === 0) {
                delete updatedPostReaction[reaction.name];
            }
            setPostReaction(updatedPostReaction);
        }

        if (reactions && reactions[reaction.name]) {
            const index = reactions[reaction.name].findIndex(
                (item) => item.user_id === currentUserProfile.user_id
            );
            if (index > -1) {
                reactions[reaction.name].splice(index, 1);
                if (reactions[reaction.name].length === 0) {
                    delete reactions[reaction.name];
                }
                setReactions({ ...reactions });
            }
        }
    } else {
        const newPostReaction = { ...postReaction };

        if (currentReaction) {
            newPostReaction[currentReaction.name] =
                (newPostReaction[currentReaction.name] || 0) - 1;
            if (newPostReaction[currentReaction.name] === 0) {
                delete newPostReaction[currentReaction.name];
            }
        }

        newPostReaction[reaction.name] =
            (newPostReaction[reaction.name] || 0) + 1;
        setPostReaction(newPostReaction);

        let updatedReactions = { ...reactions };

        if (reactions) {
            Object.keys(reactions).forEach((key) => {
                if (reactions[key].length > 0) {
                    const index = reactions[key].findIndex(
                        (item) => item.user_id === currentUserProfile.user_id
                    );
                    if (index > -1) {
                        updatedReactions[key].splice(index, 1);
                        if (updatedReactions[key].length === 0) {
                            delete updatedReactions[key];
                        }
                    }
                }
            });
        }

        const newReactions = reactions?.[reaction.name]
            ? [...reactions[reaction.name], currentUserProfile]
            : [currentUserProfile];
        updatedReactions[reaction.name] = newReactions;

        setReactions(updatedReactions);
        setCurrentReaction(reaction);
    }

    if (type === "comment") {
        handleReactionToComment(postId, reaction.name);
    } else {
        handleCreateReaction(postId, reaction.name);
    }
};

export default handleReactionClick;
