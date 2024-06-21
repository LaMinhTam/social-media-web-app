import { UserResponse } from "@/types/userType";
import CryptoJS from "crypto-js";
import { saveUser } from ".";

export default function saveUserInfoToCookie(
    user: UserResponse,
    accessToken: string
) {
    const cipherText = CryptoJS.AES.encrypt(
        JSON.stringify(user),
        accessToken
    ).toString();
    saveUser(cipherText);
}
