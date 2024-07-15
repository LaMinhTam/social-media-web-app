import { AxiosResponse } from "axios";
import apiRoutes from ".";
import { axiosPrivate } from "./axios";
import PostResponse, {
    CommentData,
    ReactionPostDetailResponse,
} from "@/types/postType";

const createPost = async (data: {
    content: string;
    co_author: number[];
    media: string[];
}) => {
    const response: AxiosResponse<string> = await axiosPrivate.post(
        apiRoutes.post.createPost,
        data
    );
    return response;
};

const getNewFeeds = async (page: number, size: number) => {
    const response: AxiosResponse<PostResponse> = await axiosPrivate.get(
        apiRoutes.post.newFeed(page, size)
    );
    return response;
};

const reactionToPost = async (target: string, type: string) => {
    const response: AxiosResponse<string> = await axiosPrivate.post(
        apiRoutes.post.reactionPost,
        {
            target,
            type,
        }
    );
    return response;
};

const reactionPostDetail = async (id: string) => {
    const response: AxiosResponse<ReactionPostDetailResponse> =
        await axiosPrivate.get(apiRoutes.post.reactionPostDetail(id));
    return response;
};

const commentOnPost = async (
    id: string,
    page: number,
    size: number,
    sortStrategy: string
) => {
    const response: AxiosResponse<CommentData[]> = await axiosPrivate.get(
        apiRoutes.post.commentOnPost(id, page, size, sortStrategy)
    );
    return response;
};

const commentPost = async (data: {
    post_id: string;
    content: string;
    media?: string[];
    tags?: number[];
    parent_comment_id?: string;
}) => {
    const response: AxiosResponse<string> = await axiosPrivate.post(
        apiRoutes.post.commentPost,
        data
    );
    return response;
};

export const POST = {
    createPost,
    getNewFeeds,
    reactionToPost,
    reactionPostDetail,
    commentOnPost,
    commentPost,
};
