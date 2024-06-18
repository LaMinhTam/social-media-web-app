import { useSocket } from "@/contexts/socket-context";

export default function handleScrollToReplyMessage(
    id: string,
    messageRefs: any
) {
    const messageElement = messageRefs[id]?.current;
    const containerElement = document.getElementById("chat-content");

    if (messageElement && containerElement) {
        // Scroll the container to the top of the selected message
        const topPos = messageElement.offsetTop - containerElement.offsetTop;
        containerElement.scrollTop = topPos;
    }
}
