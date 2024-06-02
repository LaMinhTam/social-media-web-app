export type SignUpResponse = {
    success: boolean;
    message: string;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
};