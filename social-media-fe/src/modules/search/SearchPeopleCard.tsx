import {
    handleAcceptFriendRequest,
    handleRevokeFriendRequest,
    handleSendFriendRequest,
} from "@/services/friend.service";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import {
    setShowChatModal,
    setTriggerReFetchingRelationship,
} from "@/store/actions/commonSlice";
import { setUserClicked } from "@/store/actions/userSlice";
import { RootState } from "@/store/configureStore";
import { Button, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Member } from "@/types/conversationType";

const SearchPeopleCard = ({ user }: { user: Member }) => {
    const dispatch = useDispatch();
    const triggerReFetchingRelationship = useSelector(
        (state: RootState) => state.common.triggerReFetchingRelationship
    );
    const [loading, setLoading] = React.useState(false);
    const relationshipUsers = useSelector(
        (state: RootState) => state.user.relationshipUsers
    );

    const isFriend = relationshipUsers.friends[user.user_id.toString()]
        ? true
        : false;
    const isBlocked = relationshipUsers.blocked[user.user_id.toString()]
        ? true
        : false;
    const isReceiveRequest = relationshipUsers.receive_request[
        user.user_id.toString()
    ]
        ? true
        : false;
    const isSendRequest = relationshipUsers.send_request[
        user.user_id.toString()
    ]
        ? true
        : false;

    const textContent = () => {
        if (isFriend) {
            return "Nhắn tin";
        } else if (isBlocked) {
            return "Hủy chặn";
        } else if (isReceiveRequest) {
            return "Chấp nhận";
        } else if (isSendRequest) {
            return "Hủy yêu cầu";
        }
        return "Thêm bạn bè";
    };

    const handleClicked = async () => {
        setLoading(true);
        if (isFriend) {
            // dispatch(setShowChatModal(true));
            // dispatch(setUserClicked(user));
            setLoading(false);
        } else if (isBlocked) {
            // handle unblock
            setLoading(false);
        } else if (isReceiveRequest) {
            await handleAcceptFriendRequest(
                user.user_id,
                relationshipUsers.receive_request[user.user_id]
                    .friend_request_id
            );
            dispatch(
                setTriggerReFetchingRelationship(!triggerReFetchingRelationship)
            );
            setLoading(false);
        } else if (isSendRequest) {
            await handleRevokeFriendRequest(
                user.user_id,
                relationshipUsers.send_request[user.user_id].friend_request_id
            );
            dispatch(
                setTriggerReFetchingRelationship(!triggerReFetchingRelationship)
            );
            setLoading(false);
        } else {
            await handleSendFriendRequest(user.user_id);
            dispatch(
                setTriggerReFetchingRelationship(!triggerReFetchingRelationship)
            );
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[680px] h-full bg-lite px-2 py-4 rounded-lg">
            <div className="flex items-center justify-start flex-1 gap-x-2">
                <div className="w-[60px] h-[60px] rounded-full">
                    <Image
                        src={user.image_url}
                        width={60}
                        height={60}
                        className="object-cover w-full h-full rounded-full"
                        alt="avatar"
                    ></Image>
                </div>
                <div className="flex items-center justify-center flex-1">
                    <div className="flex items-center justify-start flex-1">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-full h-full rounded bg-lite">
                                {user.name}
                            </div>
                            <div className="w-full h-full mt-1 rounded bg-lite">
                                Sống tại Thành phố Hồ Chí Minh
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="text"
                        color="primary"
                        sx={{
                            textTransform: "none",
                        }}
                        onClick={handleClicked}
                        disabled={loading}
                    >
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <Typography>{textContent()}</Typography>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchPeopleCard;
