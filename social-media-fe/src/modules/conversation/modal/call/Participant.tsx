import sendMessage from "@/utils/conversation/call-group/sendMessage";
import { WebRtcPeer } from "kurento-utils";

const PARTICIPANT_MAIN_CLASS = "participant main";
const PARTICIPANT_CLASS = "participant";

class Participant {
    name: string;
    container: HTMLDivElement;
    video: HTMLVideoElement;
    rtcPeer: WebRtcPeer | null = null;
    ws: WebSocket;

    constructor(name: string, ws: WebSocket, participant: HTMLDivElement) {
        this.name = name;
        this.ws = ws;
        this.container = document.createElement("div");
        this.container.className = this.isPresentMainParticipant()
            ? PARTICIPANT_CLASS
            : PARTICIPANT_MAIN_CLASS;
        this.container.id = name;

        const span = document.createElement("span");
        this.video = document.createElement("video");
        this.container.appendChild(this.video);
        this.container.appendChild(span);
        this.container.onclick = this.switchContainerClass.bind(this);

        participant!.appendChild(this.container);
        span.appendChild(document.createTextNode(name));

        this.video.id = `video-${name}`;
        this.video.autoplay = true;
        this.video.controls = false;
    }

    getElement(): HTMLDivElement {
        return this.container;
    }

    getVideoElement(): HTMLVideoElement {
        return this.video;
    }

    switchContainerClass(): void {
        if (this.container.className === PARTICIPANT_CLASS) {
            const elements = Array.from(
                document.getElementsByClassName(
                    PARTICIPANT_MAIN_CLASS
                ) as HTMLCollectionOf<HTMLDivElement>
            );
            elements.forEach((item) => {
                item.className = PARTICIPANT_CLASS;
            });

            this.container.className = PARTICIPANT_MAIN_CLASS;
        } else {
            this.container.className = PARTICIPANT_CLASS;
        }
    }

    isPresentMainParticipant(): boolean {
        return (
            document.getElementsByClassName(PARTICIPANT_MAIN_CLASS).length !== 0
        );
    }

    offerToReceiveVideo(
        error: Error | null,
        offerSdp: RTCSessionDescription,
        wp?: any
    ): void {
        if (error) return console.error("sdp offer error");
        console.log("Invoking SDP offer callback function");
        const msg = {
            id: "receiveVideoFrom",
            sender: this.name,
            sdpOffer: offerSdp,
        };
        sendMessage(msg, this.ws);
    }

    onIceCandidate(candidate: RTCIceCandidate, wp?: any): void {
        console.log("Local candidate" + JSON.stringify(candidate));

        const message = {
            id: "onIceCandidate",
            candidate: candidate,
            name: this.name,
        };
        sendMessage(message, this.ws);
    }

    enableVideo(): void {
        if (this.rtcPeer) {
            const videoTracks = this.rtcPeer.getLocalStream().getVideoTracks();
            if (videoTracks.length > 0) {
                videoTracks[0].enabled = true; // Enable video track
            }
        }
    }

    disableVideo(): void {
        if (this.rtcPeer) {
            const videoTracks = this.rtcPeer.getLocalStream().getVideoTracks();
            if (videoTracks.length > 0) {
                videoTracks[0].enabled = false; // Disable video track
            }
        }
    }

    enableMic(): void {
        if (this.rtcPeer) {
            const audioTracks = this.rtcPeer.getLocalStream().getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks[0].enabled = true; // Enable audio track
            }
        }
    }

    disableMic(): void {
        if (this.rtcPeer) {
            const audioTracks = this.rtcPeer.getLocalStream().getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks[0].enabled = false; // Disable audio track
            }
        }
    }

    dispose(): void {
        console.log("Disposing participant " + this.name);
        if (this.rtcPeer && typeof this.rtcPeer.dispose === "function") {
            this.rtcPeer.dispose();
        }
        this.container.parentNode?.removeChild(this.container);
    }
}

export default Participant;
