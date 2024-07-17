import { FriendRequestData } from "@/types/userType";

export default function sortedPersonToAlphabet(
    personList: FriendRequestData[]
) {
    const sortedPersonList = [...personList].sort((a, b) => {
        if (typeof a.name === "string" && typeof b.name === "string") {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    const groupedPersonList = sortedPersonList.reduce(
        (acc: { [key: string]: FriendRequestData[] }, person) => {
            if (typeof person.name === "string") {
                const firstLetter = person.name[0].toUpperCase();
                if (!acc[firstLetter]) {
                    acc[firstLetter] = [];
                }
                acc[firstLetter].push(person);
            }
            return acc;
        },
        {}
    );

    return Object.entries(groupedPersonList).map(([key, data]) => ({
        key,
        data,
    }));
}
