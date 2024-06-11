export const API_BASE_URL = "https://localhost:8060";

export const APP_BASE_URL = "http://localhost:3000";

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
