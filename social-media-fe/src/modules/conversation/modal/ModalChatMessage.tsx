import React from "react";

const ModalChatMessage = ({
    type,
    message,
}: {
    type: string;
    message: string;
}) => {
    return (
        <div
            className={`rounded-lg w-fit max-w-[212px] px-3 py-2 ${
                type === "send"
                    ? "bg-secondary text-lite ml-auto"
                    : "bg-strock text-text1 mr-auto"
            }`}
            style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
        >
            <p className="text-wrap">{message}</p>
        </div>
    );
};

export default ModalChatMessage;
