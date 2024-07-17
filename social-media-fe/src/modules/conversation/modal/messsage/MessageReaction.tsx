import { MessageData } from "@/types/conversationType";
import { MESSAGE_TYPE } from "@/constants/global";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";
import ReactionDialog from "./ReactionDialog";

const MessageReaction = ({ message }: { message: MessageData }) => {
    const [showReactionDialog, setShowReactionDialog] = React.useState(false);
    const mostReaction = Object.keys(message.reactions ?? {}).reduce(
        (a, b) =>
            (message.reactions?.[a]?.length ?? 0) >
            (message.reactions?.[b]?.length ?? 0)
                ? a
                : b,
        ""
    );
    if (!message || !mostReaction) return null;
    return (
        <>
            {message.type !== MESSAGE_TYPE.REVOKED &&
                Object.keys(message.reactions ?? {}).length > 0 && (
                    <div className="flex items-center gap-x-1">
                        <Button
                            key={uuidv4()}
                            className={`absolute bottom-[-20px] right-[-15px]`}
                            onClick={() => setShowReactionDialog(true)}
                        >
                            {handleRenderReactionMessage(mostReaction)}
                        </Button>
                    </div>
                )}
            {showReactionDialog && (
                <ReactionDialog
                    openReactionDialog={showReactionDialog}
                    setOpenReactionDialog={setShowReactionDialog}
                    reactions={message.reactions ?? {}}
                ></ReactionDialog>
            )}
        </>
    );
};

export default MessageReaction;
