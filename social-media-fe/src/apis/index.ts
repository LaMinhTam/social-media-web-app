const auth = {
    signup: "/auth/signup",
    login: "/auth/login",
    refresh: "/auth/refresh",
    userDetails: "/auth/user/me",
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
};

const conversation = {
    create: "/conversations/create",
    list: "/conversations/list",
    detail: (id: string) => `/conversations/detail/${id}`,
    disband: (id: string) => `/conversations/disband/${id}`,
    getUserStatus: (id: string) => `/user-status/online?user_ids=${id}`,
};

const apiRoutes = {
    auth,
    user,
    conversation,
};

export default apiRoutes;
