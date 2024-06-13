import { GroupedMessage, MessageData } from "@/types/conversationType";
import moment from "moment-timezone";

export function groupMessages(messages: MessageData[]): GroupedMessage[] {
    const groupedMessages: GroupedMessage[] = [];
    let currentGroup: GroupedMessage | null = null;

    messages.forEach((message) => {
        let messageTime = moment(message.created_at);
        if (currentGroup && messageTime.diff(currentGroup.time, "hours") < 1) {
            currentGroup.data.push(message);
        } else {
            const formattedTime = messageTime.isSame(moment(), "day")
                ? `Hôm nay ${messageTime.format("HH:mm")}`
                : messageTime.format("HH:mm DD/MM/YYYY");
            currentGroup = {
                time: messageTime,
                formattedTime: formattedTime,
                data: [message],
            };
            groupedMessages.push(currentGroup);
        }
    });

    return groupedMessages;
}

export default function formatTime(timestamp: number) {
    if (!timestamp) return;
    else {
        const date = moment(timestamp).tz("Asia/Ho_Chi_Minh");
        const hours: number = date.hours();
        const minutes: number = date.minutes();

        // Pad the minutes and hours with 0s on the left if they are less than 10
        const paddedHours: string = hours < 10 ? "0" + hours : hours.toString();
        const paddedMinutes: string =
            minutes < 10 ? "0" + minutes : minutes.toString();

        const timeString = `${paddedHours}:${paddedMinutes}`;
        return timeString;
    }
}
