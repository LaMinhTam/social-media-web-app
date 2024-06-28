import { MESSAGE_TYPE } from "@/constants/global";
import { LastMessage } from "@/types/conversationType";

export default function handleRenderLastMessage(last_message: LastMessage) {
    let lastMessageContent = "";
    if (last_message.type === MESSAGE_TYPE.IMAGE) {
        lastMessageContent = "image";
    } else if (last_message.type === MESSAGE_TYPE.FILE) {
        lastMessageContent = "file";
    } else if (last_message.type === MESSAGE_TYPE.VIDEO) {
        lastMessageContent = "video";
    } else if (last_message.type === MESSAGE_TYPE.STICKER) {
        lastMessageContent = "sticker";
    } else if (last_message.type === MESSAGE_TYPE.GIF) {
        lastMessageContent = "GIF";
    } else if (last_message.type === MESSAGE_TYPE.NOTIFICATION) {
        lastMessageContent = "notification";
    } else {
        lastMessageContent = last_message.content;
    }
    return lastMessageContent;
}
