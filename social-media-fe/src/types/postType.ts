import { Member } from "./conversationType";

export interface PostData {
    post_id: string;
    authors: Member[];
    content: string;
    media: string[];
    create_at: number;
    update_at: number;
    reactions?: {
        [key: string]: number;
    };
}

type PostResponse = {
    [key: string]: PostData;
};

type ReactionPostDetailResponse = {
    [key: string]: Member[];
};

interface CommentData {
    comment_id: string;
    content: string;
    media?: string[];
    author: Member;
    tags?: Member[];
    create_at: number;
    update_at: number;
    child_comments?: CommentData[];
    reactions?: {
        [key: string]: number;
    };
}

export default PostResponse;

export type { ReactionPostDetailResponse, CommentData };
