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
import { useRouter } from "next/navigation";

const SearchPeopleCard = ({ user }: { user: Member }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const triggerReFetchingRelationship = useSelector(
        (state: RootState) => state.common.triggerReFetchingRelationship
    );
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const [loading, setLoading] = React.useState(false);
    const relationshipUsers = useSelector(
        (state: RootState) => state.user.relationshipUsers
    );

    const isFriend = Object.keys(relationshipUsers.friends ?? {}).includes(
        user.user_id.toString()
    )
        ? true
        : false;
    const isBlocked = Object.keys(relationshipUsers.blocked ?? {}).includes(
        user.user_id.toString()
    )
        ? true
        : false;
    const isReceiveRequest = Object.keys(
        relationshipUsers.receive_request ?? {}
    ).includes(user.user_id.toString())
        ? true
        : false;
    const isSendRequest = Object.keys(
        relationshipUsers.send_request ?? {}
    ).includes(user.user_id.toString())
        ? true
        : false;

    const textContent = () => {
        if (isFriend) {
            return "View profile";
        } else if (isBlocked) {
            return "Revoke block";
        } else if (isReceiveRequest) {
            return "Accept friend request";
        } else if (isSendRequest) {
            return "Revoke friend request";
        }
        return "Add friend";
    };

    const handleClicked = async () => {
        setLoading(true);
        if (isFriend) {
            router.push(`/user/${user.user_id}`);
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
                        className="object-cover w-full h-full rounded-full cursor-pointer"
                        alt="avatar"
                        onClick={() => {
                            if (currentUserProfile.user_id === user.user_id) {
                                router.push("/me");
                            } else {
                                router.push(`/user/${user.user_id}`);
                            }
                        }}
                    ></Image>
                </div>
                <div className="flex items-center justify-center flex-1">
                    <div className="flex items-center justify-start flex-1">
                        <div className="flex flex-col items-center justify-center">
                            <div
                                className="w-full h-full rounded cursor-pointer bg-lite"
                                onClick={() => {
                                    if (
                                        currentUserProfile.user_id ===
                                        user.user_id
                                    ) {
                                        router.push("/me");
                                    } else {
                                        router.push(`/user/${user.user_id}`);
                                    }
                                }}
                            >
                                {user.name}
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="text"
                        color="primary"
                        sx={{
                            textTransform: "none",
                        }}
                        onClick={() => {
                            if (user.user_id === currentUserProfile.user_id) {
                                router.push("/me");
                            } else {
                                handleClicked();
                            }
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <Typography>
                                {currentUserProfile.user_id === user.user_id
                                    ? "View profile"
                                    : textContent()}
                            </Typography>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchPeopleCard;
