import { db } from "@/constants/firebaseConfig";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export default async function handleUpdateUnreadMessage(
    conversationId: string,
    userId: number,
    messageId: string
) {
    const unreadTrackRef = doc(collection(db, "unreadTrack"), conversationId);

    const docSnap = await getDoc(unreadTrackRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const listUnreadMessage = data.list_unread_message || {};

        // Check if the user already has unread messages
        if (!listUnreadMessage[userId]) {
            listUnreadMessage[userId] = [];
        }

        // Add the new message to the user's unread messages
        listUnreadMessage[userId].push({
            user_id: userId,
            message_id: messageId,
        });

        // Save the updated document back to Firestore
        await setDoc(
            unreadTrackRef,
            { ...data, list_unread_message: listUnreadMessage },
            { merge: true }
        );
    }
}
