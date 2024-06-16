export const API_BASE_URL = "https://localhost:8060";

export const APP_BASE_URL = "http://localhost:3000";

export const SOCKET_URL = "https://localhost:8060/websocket/ws";

export const OAUTH2_REDIRECT_URI = `${APP_BASE_URL}/oauth2/redirect`;

export const GOOGLE_AUTH_URL =
    "http://localhost:9004/oauth2/authorize/google?redirect_uri=" +
    OAUTH2_REDIRECT_URI;
export const FACEBOOK_AUTH_URL =
    "http://localhost:9004/oauth2/authorize/facebook?redirect_uri=" +
    OAUTH2_REDIRECT_URI;
export const GITHUB_AUTH_URL =
    "http://localhost:9004/oauth2/authorize/github?redirect_uri=" +
    OAUTH2_REDIRECT_URI;

export const GIF_URL_TRENDING_ENDPOINT =
    "https://api.giphy.com/v1/gifs/trending";
export const STICKER_URL_TRENDING_ENDPOINT =
    "https://api.giphy.com/v1/stickers/trending";
export const GIF_URL_SEARCH_ENDPOINT = "https://api.giphy.com/v1/gifs/search";
export const STICKER_URL_SEARCH_ENDPOINT =
    "https://api.giphy.com/v1/stickers/search";

export const MESSAGE_TYPE = {
    TEXT: "TEXT",
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    FILE: "FILE",
    LOCATION: "LOCATION",
    CONTACT: "CONTACT",
    STICKER: "STICKER",
    EMOJI: "EMOJI",
    GIF: "GIF",
    VOICE: "VOICE",
    CALL: "CALL",
    NOTIFICATION: "NOTIFICATION",
    SYSTEM: "SYSTEM",
    FORWARD: "FORWARD",
    REPLY: "REPLY",
    REVOKED: "REVOKED",
    TEST: "TEST",
};

export const REACTION_TYPE = {
    LIKE: "LIKE",
    LOVE: "LOVE",
    HAHA: "HAHA",
    WOW: "WOW",
    SAD: "SAD",
    ANGRY: "ANGRY",
};

export const REACTIONS_DATA = [
    { name: "LOVE", emoji: "❤️" },
    { name: "HAHA", emoji: "😆" },
    { name: "WOW", emoji: "😮" },
    { name: "SAD", emoji: "😢" },
    { name: "ANGRY", emoji: "😠" },
    { name: "LIKE", emoji: "👍" },
];
