export interface OnlineStatus {
    user_id: string;
    online: string;
    timestamp: number;
}

export type OnlineResponse = {
    [key: string]: OnlineStatus;
};
