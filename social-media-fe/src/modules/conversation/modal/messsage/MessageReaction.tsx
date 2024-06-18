import { MessageData } from "@/types/conversationType";
import { MESSAGE_TYPE } from "@/constants/global";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import handleRenderReactionMessage from "@/utils/conversation/messages/handleRenderReactionMessage";

const MessageReaction = ({ message }: { message: MessageData }) => {
    return (
        <>
            {message.type !== MESSAGE_TYPE.REVOKED &&
                Object.keys(message.reactions ?? {}).length > 0 && (
                    <div className="flex items-center gap-x-1">
                        {Object.keys(message.reactions ?? {}).map(
                            (reaction) => (
                                <Button
                                    key={uuidv4()}
                                    className={`absolute bottom-[-20px] right-[-15px]`}
                                >
                                    {handleRenderReactionMessage(reaction)}
                                </Button>
                            )
                        )}
                    </div>
                )}
        </>
    );
};

export default MessageReaction;
