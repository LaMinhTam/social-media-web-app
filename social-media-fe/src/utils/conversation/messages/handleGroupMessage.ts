import { MessageData, MessageResponse } from "@/types/conversationType";
import moment from "moment";

interface GroupedMessage {
    time: moment.Moment;
    formattedTime: string;
    data: MessageResponse[];
}

export default function groupMessages(messages: {
    [key: string]: MessageResponse;
}) {
    const groupedMessages: GroupedMessage[] = [];
    let currentGroup: GroupedMessage | null = null;

    const messagesArray = Object.values(messages);

    messagesArray.forEach((message) => {
        let messageTime = moment(message.created_at as moment.MomentInput);
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

// export function groupMessagesByDate(messages: MessageResponse) {
//     const groupedMessages = [];
//     let currentGroup = null;

//     messages.forEach((message) => {
//         let messageTime = moment(message.created_at);
//         if (currentGroup && messageTime.isSame(currentGroup.time, "day")) {
//             currentGroup.data.push(message);
//         } else {
//             const formattedTime = messageTime.isSame(moment(), "day")
//                 ? "Hôm nay"
//                 : messageTime.format("DD/MM/YYYY");
//             currentGroup = {
//                 time: messageTime,
//                 formattedTime: formattedTime,
//                 data: [message],
//             };
//             groupedMessages.push(currentGroup);
//         }
//     });

//     return groupedMessages;
// }
