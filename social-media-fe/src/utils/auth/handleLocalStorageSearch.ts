import { Member } from "@/types/conversationType";
import CryptoJS from "crypto-js";

const SECRET_KEY = "NaiKI4TtdZZ2j3YwYLR5AoU1RDbyB3Iv";

export function saveSearchResultToLocalStorage(result: Member[]) {
    if (typeof window !== "undefined") {
        const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(result),
            SECRET_KEY
        ).toString();
        localStorage.setItem("SEARCH_RESULT", encryptedData);
    }
}

export function getSearchResultFromLocalStorage(): Member[] {
    if (typeof window !== "undefined") {
        const encryptedData = localStorage.getItem("SEARCH_RESULT");
        if (encryptedData) {
            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedData;
        }
    }
    return [];
}

export function deleteSearchResultFromLocalStorage() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("SEARCH_RESULT");
    }
}
