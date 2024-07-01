export const HOST_NAME = "localhost";
export const API_BASE_URL = `https://${HOST_NAME}:8060`;

export const APP_BASE_URL = `https://${HOST_NAME}:3000`;

export const SOCKET_URL = `https://${HOST_NAME}:8060/websocket/ws`;

export const OAUTH2_REDIRECT_URI = `${APP_BASE_URL}/oauth2/redirect`;

export const GOOGLE_AUTH_URL =
    `http://${HOST_NAME}:9004/oauth2/authorize/google?redirect_uri=` +
    OAUTH2_REDIRECT_URI;
export const FACEBOOK_AUTH_URL =
    `http://${HOST_NAME}:9004/oauth2/authorize/facebook?redirect_uri=` +
    OAUTH2_REDIRECT_URI;
export const GITHUB_AUTH_URL =
    `http://${HOST_NAME}:9004/oauth2/authorize/github?redirect_uri=` +
    OAUTH2_REDIRECT_URI;

export const GIF_URL_TRENDING_ENDPOINT = `https://api.giphy.com/v1/gifs/trending`;
export const STICKER_URL_TRENDING_ENDPOINT = `https://api.giphy.com/v1/stickers/trending`;
export const GIF_URL_SEARCH_ENDPOINT = `https://api.giphy.com/v1/gifs/search`;
export const STICKER_URL_SEARCH_ENDPOINT = `https://api.giphy.com/v1/stickers/search`;

export const CALL_WS_URL = `wss://${HOST_NAME}:8060/websocket/call`;
export const CALL_GROUP_WS_URL = `wss://${HOST_NAME}:8060/websocket/groupcall`;

export const MESSAGE_TYPE = {
    TEXT: `TEXT`,
    IMAGE: `IMAGE`,
    VIDEO: `VIDEO`,
    FILE: `FILE`,
    LOCATION: `LOCATION`,
    CONTACT: `CONTACT`,
    STICKER: `STICKER`,
    EMOJI: `EMOJI`,
    GIF: `GIF`,
    VOICE: `VOICE`,
    CALL: `CALL`,
    NOTIFICATION: `NOTIFICATION`,
    SYSTEM: `SYSTEM`,
    FORWARD: `FORWARD`,
    REPLY: `REPLY`,
    REVOKED: `REVOKED`,
    TEST: `TEST`,
};

export const NOTIFICATION_TYPE = {
    ADD_MEMBER: `ADD_MEMBER`,
    REMOVE_MEMBER: `REMOVE_MEMBER`,
    CHANGE_GROUP_NAME: `CHANGE_GROUP_NAME`,
    CHANGE_GROUP_AVATAR: `CHANGE_GROUP_AVATAR`,
    CHANGE_GROUP_SETTINGS: `CHANGE_GROUP_SETTINGS`,
    LEAVE_GROUP: `LEAVE_GROUP`,
    DISBAND_GROUP: `DISBAND_GROUP`,
    CHANGE_GROUP_OWNER: `CHANGE_GROUP_OWNER`,
    GRANT_DEPUTY: `GRANT_DEPUTY`,
    REVOKE_DEPUTY: `REVOKE_DEPUTY`,
    UPDATE_GROUP_SETTINGS: `UPDATE_GROUP_SETTINGS`,
    CONFIRM_NEW_MEMBER: `CONFIRM_NEW_MEMBER`,
    RESTRICTED_MESSAGING: `RESTRICTED_MESSAGING`,
    DEPUTY_SEND_MESSAGES: `DEPUTY_SEND_MESSAGES`,
    JOIN_BY_LINK: `JOIN_BY_LINK`,
    UPDATE_LINK_TO_JOIN_GROUP: `UPDATE_LINK_TO_JOIN_GROUP`,
    MEMBER_CHANGE_GROUP_INFO: `MEMBER_CHANGE_GROUP_INFO`,
    DEPUTY_INVITE_MEMBER: `DEPUTY_INVITE_MEMBER`,
    MEMBER_INVITE_MEMBER: `MEMBER_INVITE_MEMBER`,
    DEPUTY_REMOVE_MEMBER: `DEPUTY_REMOVE_MEMBER`,
    DEPUTY_CHANGE_GROUP_INFO: `DEPUTY_CHANGE_GROUP_INFO`,
    MEMBER_PIN_MESSAGE: `MEMBER_PIN_MESSAGE`,
    DEPUTY_PROMOTE_MEMBER: `DEPUTY_PROMOTE_MEMBER`,
    DEPUTY_DEMOTE_MEMBER: `DEPUTY_DEMOTE_MEMBER`,
};

export const REACTION_TYPE = {
    LIKE: `LIKE`,
    LOVE: `LOVE`,
    HAHA: `HAHA`,
    WOW: `WOW`,
    SAD: `SAD`,
    ANGRY: `ANGRY`,
};

export const REACTIONS_DATA = [
    { name: `LOVE`, emoji: `❤️` },
    { name: `HAHA`, emoji: `😆` },
    { name: `WOW`, emoji: `😮` },
    { name: `SAD`, emoji: `😢` },
    { name: `ANGRY`, emoji: `😠` },
    { name: `LIKE`, emoji: `👍` },
];

export const CALL_STATE = {
    NO_CALL: "NO_CALL",
    PROCESSING_CALL: "PROCESSING_CALL",
    IN_CALL: "IN_CALL",
};

export const REGISTER_STATE = {
    NOT_REGISTERED: 0,
    REGISTERING: 1,
    REGISTERED: 2,
};
