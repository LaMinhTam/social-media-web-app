import { db } from "@/constants/firebaseConfig";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export async function handleRemoveUnreadMessage(
    conversationId: string,
    userId: number
) {
    const unreadTrackRef = doc(collection(db, "unreadTrack"), conversationId);

    // Get the current document
    const docSnap = await getDoc(unreadTrackRef);

    if (docSnap.exists()) {
        // Get the current data
        const data = docSnap.data();

        if (data && data.list_unread_message) {
            // Remove the unread message for the user
            delete data.list_unread_message[userId];

            // Write the data back to the document
            await setDoc(unreadTrackRef, data, { merge: true });
        }
    }
}
