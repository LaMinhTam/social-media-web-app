import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useClickOutSide from "@/hooks/useClickOutSide";
import { RootState } from "@/store/configureStore";
import ModalChatHeader from "@/modules/conversation/modal/ModalChatHeader";
import ModalChatFooter from "@/modules/conversation/modal/ModalChatFooter";
import ModalChatContent from "@/modules/conversation/modal/ModalChatContent";
import { handleGetUserStatus } from "@/services/conversation.service";
import { OnlineResponse, OnlineStatus } from "@/types/commonType";

const ChatModal = () => {
    const dispatch = useDispatch();
    const {
        show: isActive,
        setShow: setIsActive,
        nodeRef: activeRef,
    } = useClickOutSide();
    const [showFullInput, setShowFullInput] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [userStatus, setUserStatus] = React.useState<OnlineStatus>(
        {} as OnlineStatus
    );
    const [messageShow, setMessageShow] = React.useState<string>("");
    const userClicked = useSelector(
        (state: RootState) => state.user.userClicked
    );

    useEffect(() => {
        async function getStatus() {
            const data = await handleGetUserStatus(
                userClicked.user_id.toString()
            );
            if (data) {
                setUserStatus(data[userClicked.user_id.toString()]);
            }
        }
        if (userClicked) {
            getStatus();
        }
    }, []);

    if (!userClicked) return null;
    return (
        <div className="w-[328px] h-[467px] rounded-lg flex flex-col">
            <ModalChatHeader
                userStatus={userStatus}
                username={userClicked.name}
                dispatch={dispatch}
                avatar={userClicked.image_url}
            ></ModalChatHeader>
            <ModalChatContent message={messageShow}></ModalChatContent>
            <ModalChatFooter
                isActive={isActive}
                setIsActive={setIsActive}
                showFullInput={showFullInput}
                setShowFullInput={setShowFullInput}
                setMessage={setMessage}
                setMessageShow={setMessageShow}
                activeRef={activeRef}
                message={message}
            ></ModalChatFooter>
        </div>
    );
};

export default ChatModal;
