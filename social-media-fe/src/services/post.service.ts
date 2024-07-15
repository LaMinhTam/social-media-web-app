import { SOCIAL_MEDIA_API } from "@/apis/constants";

export const handleCreatePost = async (data: {
    content: string;
    co_author: number[];
    media: string[];
}) => {
    try {
        const response = await SOCIAL_MEDIA_API.POST.createPost(data);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};

export const handleGetNewFeed = async (page: number, size: number) => {
    try {
        const response = await SOCIAL_MEDIA_API.POST.getNewFeeds(page, size);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};

export const handleCreateReaction = async (id: string, reaction: string) => {
    try {
        const response = await SOCIAL_MEDIA_API.POST.reactionToPost(
            id,
            reaction
        );
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};

export const handleGetPostReactionDetail = async (id: string) => {
    try {
        const response = await SOCIAL_MEDIA_API.POST.reactionPostDetail(id);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};

export const handleGetCommentOnPost = async (
    id: string,
    page: number,
    size: number,
    sortStrategy: string
) => {
    try {
        const response = await SOCIAL_MEDIA_API.POST.commentOnPost(
            id,
            page,
            size,
            sortStrategy
        );
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};

export const handleCreateComment = async (data: {
    post_id: string;
    content: string;
    media?: string[];
    tags?: number[];
    parent_comment_id?: string;
}) => {
    try {
        const response = await SOCIAL_MEDIA_API.POST.commentPost(data);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
