// import { Member } from "@/types/conversationType";

// export default function handleRenderAuthor(authors: Member[]) {
//     if (!authors) return "";
//     let str = "";
//     if (authors?.length > 2) {
//         authors.forEach((author, index) => {
//             if (index < 2) {
//                 str += author?.name + ", ";
//             }
//         });
//         str =
//             authors?.slice(0, -2) +
//             " và " +
//             (authors.length - 2) +
//             " người khác";
//     } else if (authors?.length === 2) {
//         str = authors[0]?.name + " và " + authors[1]?.name;
//     } else {
//         str = authors[0]?.name;
//     }
//     return str;
// }

import { Member } from "@/types/conversationType";

export default function handleRenderAuthor(authors: Member[]) {
    if (!authors) return [];
    return authors.map((author) => ({
        name: author.name,
        id: author.user_id,
    }));
}
