import { FriendRequestData } from "./userType";

export interface OnlineStatus {
    user_id: string;
    online: string;
    timestamp: number;
}

export type OnlineResponse = {
    [key: string]: OnlineStatus;
};

export type UploadFileQueue = {
    fileName: string;
    size: number;
    progress: number;
    isSuccessful: boolean;
};

export type NotificationType = {
    user: FriendRequestData;
    message: string;
};
