import { db } from "@/constants/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

export default async function handleSaveUnreadMessage(
    conversationId: string,
    listUnreadMessage: {
        [key: number]: {
            user_id: number;
            message_id: string;
        }[];
    }
) {
    const unreadTrackRef = doc(collection(db, "unreadTrack"), conversationId);

    await setDoc(
        unreadTrackRef,
        {
            conversation_id: conversationId,
            list_unread_message: listUnreadMessage,
        },
        { merge: true }
    );
}
