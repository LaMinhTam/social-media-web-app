import { REACTION_TYPE } from "@/constants/global";

export default function handleRenderReactionMessage(reactionName: string) {
    let formatMessage = "";
    switch (reactionName) {
        case REACTION_TYPE.LIKE:
            formatMessage = "👍";
            break;
        case REACTION_TYPE.LOVE:
            formatMessage = "❤️";
            break;
        case REACTION_TYPE.HAHA:
            formatMessage = "😆";
            break;
        case REACTION_TYPE.WOW:
            formatMessage = "😮";
            break;
        case REACTION_TYPE.SAD:
            formatMessage = "😢";
            break;
        case REACTION_TYPE.ANGRY:
            formatMessage = "😠";
            break;
        default:
            formatMessage = "👍";
            break;
    }
    return formatMessage;
}
