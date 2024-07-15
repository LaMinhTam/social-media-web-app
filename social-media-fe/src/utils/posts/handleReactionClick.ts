import { handleCreateReaction } from "@/services/post.service";
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
    postId: string
) => {
    if (currentReaction && currentReaction?.name === reaction.name) {
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
            }
        }
    } else {
        setCurrentReaction(reaction);
        if (postReaction) {
            const updatedPostReaction = {
                ...postReaction,
                [reaction.name]: postReaction[reaction.name]
                    ? postReaction[reaction.name] + 1
                    : 1,
            };
            setPostReaction(updatedPostReaction);
        } else {
            setPostReaction({ [reaction.name]: 1 });
        }
        if (reactions) {
            const newReactions = reactions[reaction.name]
                ? [...reactions[reaction.name], currentUserProfile]
                : [currentUserProfile];
            setReactions({
                ...reactions,
                [reaction.name]: newReactions,
            });
        } else {
            setReactions({ [reaction.name]: [currentUserProfile] });
        }
    }
    await handleCreateReaction(postId, reaction.name);
};

export default handleReactionClick;
