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

const apiRoutes = {
    auth,
    user,
};

export default apiRoutes;
