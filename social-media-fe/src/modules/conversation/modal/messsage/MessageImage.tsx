import { MessageData } from "@/types/conversationType";
import { Tooltip } from "@mui/material";
import "react-photo-view/dist/react-photo-view.css";
import React from "react";
import formatTime from "@/utils/conversation/messages/handleGroupMessage";
import MessageReaction from "./MessageReaction";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";

const MessageImage = ({
    message,
    type,
}: {
    message: MessageData;
    type: string;
}) => {
    const [url, fileName, fileSize] = message.content.split(";");
    const [isOpenImage, setIsOpenImage] = React.useState(false);
    return (
        <>
            <div
                className={`relative rounded-lg w-fit max-w-[212px] px-3 py-2 my-2 ${
                    type === "send" ? "ml-auto" : "mr-auto"
                }`}
            >
                <Tooltip title={formatTime(message.created_at)}>
                    <PhotoProvider>
                        <PhotoView src={url}>
                            <Image
                                src={url}
                                onClick={() => setIsOpenImage(true)}
                                alt={fileName}
                                width={212}
                                height={200}
                                className="object-cover w-full h-[200px] rounded-lg"
                            />
                        </PhotoView>
                    </PhotoProvider>
                </Tooltip>
                <MessageReaction message={message}></MessageReaction>
            </div>
        </>
    );
};

export default MessageImage;
