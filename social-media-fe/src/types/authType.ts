export type SignUpResponse = {
    success: boolean;
    message: string;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
};

export type UserResponse = {
    id: string;
    name: string;
    emailVerified: boolean;
    provider: string;
    providerId: string;
};

export type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
};
