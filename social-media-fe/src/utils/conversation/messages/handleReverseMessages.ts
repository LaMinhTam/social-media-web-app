import { MessageResponse } from "@/types/conversationType";

export default function handleReverseMessages(messages: MessageResponse) {
    // Convert the object into an array of [key, value] pairs
    const entries = Object.entries(messages);

    // Reverse the array
    const reversedEntries = entries.reverse();

    // Convert the array back into an object
    const reversedMessages = Object.fromEntries(reversedEntries);
    return reversedMessages;
}
