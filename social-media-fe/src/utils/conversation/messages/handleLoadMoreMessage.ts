import { handleGetListMessage } from "@/services/conversation.service";

export default async function handleLoadMoreMessage(
    id: string,
    page: number,
    size: number
) {
    const data = await handleGetListMessage(id, page);
    return data;
}
