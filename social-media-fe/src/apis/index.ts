const auth = {
    signup: "/auth/signup",
    login: "/auth/login",
    refresh: "/auth/refresh",
    userDetails: "/auth/user/me",
    logout: "/auth/logout",
    resetPassword: "/auth/reset-password",
};

const user = {
    getMe: "/user/me",
    findUserById: (id: string) => `/user/${id}`,
    findUserByName: (name: string) => `/user/search?keyword=${name}`,
    getFriends: "/friends?type=0",
    sendFriendRequest: `/friends/send`,
    acceptFriendRequest: `/friends/accept`,
    removeFriend: `/friends/remove`,
    recallFriendRequest: `/friends/revoke`,
    updateProfile: "/user",
    userWall: (id: number, size: number, page: number) =>
        `/user-wall/${id}?page=${page}&size=${size}`,
    followUser: (id: number) => `/user-wall/follow/${id}`,
};

const conversation = {
    create: "/conversations/create",
    list: "/conversations/list",
    detail: (id: string) => `/conversations/detail/${id}`,
    addMember: (id: string, userId: string) =>
        `/conversations/${id}/add-member?members=${userId}`,
    kickMember: (id: string, userId: number) =>
        `/conversations/${id}/kick?member-id=${userId}`,
    leaveGroup: (id: string) => `/conversations/${id}/leave`,
    disband: (id: string) => `/conversations/disband/${id}`,
    changeName: (id: string, name: string) =>
        `/conversations/${id}/change-name?name=${name}`,
    changeImage: (id: string, imageUrl: string) =>
        `/conversations/${id}/change-image?image=${imageUrl}`,
    changeGroupOwner: (id: string, userId: number) =>
        `/conversations/${id}/grant-owner?member-id=${userId}`,
    grantDeputy: (id: string, userId: number) =>
        `/conversations/${id}/grant-deputy?member-id=${userId}`,
    revokeDeputy: (id: string, userId: number) =>
        `/conversations/${id}/revoke-deputy?member-id=${userId}`,
    updateGroupSetting: (id: string) => `/conversations/${id}/update-settings`,
    findConversationByLink: (link: string) => `/conversations/link/${link}`,
    joinConversationByLink: (link: string) => `/conversations/join/${link}`,
    getUserStatus: (id: string) => `/user-status/online?user_ids=${id}`,
    getListMessageByPage: (id: string, size: number) =>
        `/messages/${id}?size=${size}`,
    shareMessage: "/messages/share",
    revokeMessage: (id: string) => `/messages/revoke/${id}`,
    deleteMessage: (id: string) => `/messages/${id}/delete`,
    reactMessage: "/messages/react",
    readMessage: (id: string) => `/messages/${id}/read`,
    getPendingMembers: (id: string) => `/conversations/pending-member/${id}`,
    approveMemberRequest: (
        conversation_id: string,
        request_id: number,
        userId: number
    ) =>
        `/conversations/approve-pending-member?conversation_id=${conversation_id}&requester_id=${request_id}&waiting_member_id=${userId}`,
    rejectMemberRequest: (
        conversation_id: string,
        request_id: number,
        userId: number
    ) =>
        `/conversations/reject-pending-member?conversation_id=${conversation_id}&requester_id=${request_id}&waiting_member_id=${userId}`,
};

const post = {
    newFeed: (page: number, size: number) =>
        `/posts/new-feed?page=${page}&size=${size}`,
    createPost: "/posts",
    sharePost: "/posts/share",
    reactionPost: "/reactions/post",
    reactionPostDetail: (id: string) => `/reactions/post/detail/${id}`,
    commentPost: "/comments",
    commentOnPost: (
        id: string,
        page: number,
        size: number,
        sortStrategy: string
    ) => `/comments/${id}?page=${page}&size=${size}&sort=${sortStrategy}`,
    reactionToComment: "/reactions/comment",
    reactionCommentDetail: (id: string) => `/reactions/comment/detail/${id}`,
};

const apiRoutes = {
    auth,
    user,
    conversation,
    post,
};

export default apiRoutes;
