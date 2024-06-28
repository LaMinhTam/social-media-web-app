import { CALL_STATE } from "./../constants/global";
type CallType = {
    socket: WebSocket | null;
    register: (id: number) => void;
    call: (videoInput: HTMLVideoElement, videoOutput: HTMLVideoElement) => void;
    setTargetUserId: (id: number) => void;
    setVideoInput: (videoInput: HTMLVideoElement | null) => void;
    setVideoOutput: (videoOutput: HTMLVideoElement | null) => void;
    callState: string;
};

export default CallType;
