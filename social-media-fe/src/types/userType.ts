export type UserResponse = {
    user_id: number;
    name: string;
    email: string;
    image_url: string;
};

export interface FriendRequestData {
    friend_request_id: number;
    user_id: number;
    name: string;
    email: string;
    image_url: string;
}

export type ListFriendResponse = {
    user_id: number;
    send_request: Record<string, FriendRequestData>;
    receive_request: Record<string, FriendRequestData>;
    blocked: Record<string, FriendRequestData>;
    friends: Record<string, FriendRequestData>;
};
