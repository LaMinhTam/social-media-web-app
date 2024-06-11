import React from "react";
import ModalChatMessage from "./ModalChatMessage";

const ModalChatContent = ({ message }: { message: string }) => {
    return (
        <div className="flex-1 p-2 overflow-x-hidden overflow-y-auto">
            {message && (
                <ModalChatMessage
                    type="send"
                    message={message}
                ></ModalChatMessage>
            )}
        </div>
    );
};

export default ModalChatContent;
