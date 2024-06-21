import { getAccessToken, getUser } from ".";
import CryptoJS from "crypto-js";
export default function getUserInfoFromCookie() {
    const accessToken = getAccessToken();
    const encryptedUser = getUser();
    let decryptedData = null;
    if (encryptedUser && accessToken) {
        const bytes = CryptoJS.AES.decrypt(encryptedUser, accessToken);
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return decryptedData;
}
