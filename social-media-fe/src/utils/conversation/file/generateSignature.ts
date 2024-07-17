import CryptoJS from "crypto-js";

const generateSHA1 = (data: any) => {
    return CryptoJS.SHA1(data).toString(CryptoJS.enc.Hex);
};

const generateSignature = (
    publicId: string,
    apiSecret: string,
    timestamp: number
) => {
    const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    return generateSHA1(toSign);
};

export { generateSignature, generateSHA1 };
