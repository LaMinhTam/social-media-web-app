import CryptoJS from "crypto-js";
import { saveUser } from ".";
import { Member } from "@/types/conversationType";

export default function saveUserInfoToCookie(
    user: Member,
    accessToken: string
) {
    const cipherText = CryptoJS.AES.encrypt(
        JSON.stringify(user),
        accessToken
    ).toString();
    saveUser(cipherText);
}
