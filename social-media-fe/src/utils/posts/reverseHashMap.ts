import PostResponse from "@/types/postType";

export default function reverseHashMap(hashMap: PostResponse) {
    const keys = Object.keys(hashMap).reverse();
    const reversedHashMap = {} as PostResponse;
    keys.forEach((key) => {
        reversedHashMap[key] = hashMap[key];
    });
    return reversedHashMap;
}
