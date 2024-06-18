import { db } from "@/constants/firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";

export async function countUnreadMessages(conversationId: string) {
    const unreadTrackRef = doc(collection(db, "unreadTrack"), conversationId);

    const docSnap = await getDoc(unreadTrackRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        const unreadCount = data.list_unread_message.length;
        return unreadCount;
    } else {
        return 0;
    }
}
