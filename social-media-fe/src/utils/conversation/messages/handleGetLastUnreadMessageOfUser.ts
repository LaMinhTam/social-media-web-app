import { db } from "@/constants/firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";

export default async function handleGetLastUnreadMessageOfUser(
    conversationId: string,
    userId: number
) {
    const docRef = doc(collection(db, "unreadTrack"), conversationId);

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.log("No such document!");
        return null;
    } else {
        const data = docSnap.data();
        const listUnreadMessage = data.list_unread_message;

        // Assuming userId is the key in listUnreadMessage
        const userMessages = listUnreadMessage[userId];

        if (userMessages && userMessages.length > 0) {
            // Return the message_id of the last message
            return userMessages[userMessages.length - 1].message_id;
        } else {
            console.log("No messages for this user!");
            return null;
        }
    }
}
