import { Member } from "./conversationType";

type CallType = {
    socket: WebSocket | null;
    register: (id: number) => void;
    call: (videoInput: HTMLVideoElement, videoOutput: HTMLVideoElement) => void;
    setTargetUserId: (id: number) => void;
    setVideoInput: (videoInput: HTMLVideoElement | null) => void;
    setVideoOutput: (videoOutput: HTMLVideoElement | null) => void;
    callState: string;
    stop: (value?: any) => void;
    targetUserId: number;
    targetUser: Member | null;
    setTargetUser: (user: Member) => void;
    isAccepted: boolean;
    setIsAccepted: (value: boolean) => void;
};

export default CallType;
