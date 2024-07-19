import {
    handleAcceptFriendRequest,
    handleRevokeFriendRequest,
} from "@/services/friend.service";
import { setTriggerReFetchingRelationship } from "@/store/actions/commonSlice";
import { RootState } from "@/store/configureStore";
import { Button, Chip, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const MobileFriend = () => {
    const [tab, setTab] = React.useState(0);
    const relationshipUser = useSelector(
        (state: RootState) => state.user.relationshipUsers
    );
    const dispatch = useDispatch();
    const triggerReFetchingRelationship = useSelector(
        (state: RootState) => state.common.triggerReFetchingRelationship
    );

    const handleAccept = async (user_id: number, relationship_id: number) => {
        await handleAcceptFriendRequest(user_id, relationship_id);
        dispatch(
            setTriggerReFetchingRelationship(!triggerReFetchingRelationship)
        );
    };

    const handleReject = async (userId: number, relationship_id: number) => {
        await handleRevokeFriendRequest(userId, relationship_id);
        dispatch(
            setTriggerReFetchingRelationship(!triggerReFetchingRelationship)
        );
    };

    const router = useRouter();

    return (
        <div className="mt-20">
            <div className="flex items-center justify-start ml-2 gap-x-2">
                <Chip
                    label="Suggestions"
                    variant={tab === 0 ? "filled" : "outlined"}
                    color={tab === 0 ? "info" : "default"}
                    onClick={() => setTab(0)}
                />
                <Chip
                    label="Your friends"
                    variant={tab === 1 ? "filled" : "outlined"}
                    color={tab === 1 ? "info" : "default"}
                    onClick={() => setTab(1)}
                />
            </div>
            <Grid container className="gap-2 mt-2">
                {tab === 0 ? (
                    <>
                        <Typography className="ml-2 font-bold">
                            Friend requests
                        </Typography>
                        {Object.values(relationshipUser.receive_request ?? {})
                            .length > 0 &&
                            Object.values(relationshipUser.receive_request).map(
                                (user) => (
                                    <Grid item xs={12} key={user.user_id}>
                                        <div className="flex items-center p-2 gap-x-2">
                                            <Image
                                                width={92}
                                                height={92}
                                                src={user.image_url}
                                                alt="avatar"
                                                className="w-[92px] h-[92px] rounded-full cursor-pointer"
                                                onClick={() =>
                                                    router.push(
                                                        `/user/${user.user_id}`
                                                    )
                                                }
                                            />
                                            <div className="flex flex-col items-start justify-center gap-y-2">
                                                <Typography
                                                    variant="h6"
                                                    className="font-bold cursor-pointer"
                                                    onClick={() =>
                                                        router.push(
                                                            `/user/${user.user_id}`
                                                        )
                                                    }
                                                >
                                                    {user.name}
                                                </Typography>
                                                <div className="flex items-center justify-center gap-x-2">
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        onClick={() =>
                                                            handleReject(
                                                                user.user_id,
                                                                user.friend_request_id
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="info"
                                                        size="small"
                                                        onClick={() =>
                                                            handleAccept(
                                                                user.user_id,
                                                                user.friend_request_id
                                                            )
                                                        }
                                                    >
                                                        Accept
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                )
                            )}
                        <hr />
                        <Typography className="ml-2 font-bold">
                            Friend sent requests
                        </Typography>
                        {Object.values(relationshipUser.send_request ?? {})
                            .length > 0 &&
                            Object.values(relationshipUser.send_request).map(
                                (user) => (
                                    <Grid item xs={12} key={user.user_id}>
                                        <div className="flex items-center p-2 gap-x-2">
                                            <Image
                                                width={92}
                                                height={92}
                                                src={user.image_url}
                                                alt="avatar"
                                                className="w-[92px] h-[92px] rounded-full"
                                            />
                                            <div className="flex flex-col items-start justify-center gap-y-2">
                                                <Typography
                                                    variant="h6"
                                                    className="font-bold"
                                                >
                                                    {user.name}
                                                </Typography>
                                                <div className="flex items-center justify-center gap-x-2">
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        onClick={() =>
                                                            handleReject(
                                                                user.user_id,
                                                                user.friend_request_id
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="info"
                                                        size="small"
                                                        onClick={() =>
                                                            handleAccept(
                                                                user.user_id,
                                                                user.friend_request_id
                                                            )
                                                        }
                                                    >
                                                        Accept
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                )
                            )}
                    </>
                ) : (
                    <>
                        {Object.values(relationshipUser.friends).map((user) => (
                            <Grid item xs={12} key={user.user_id}>
                                <div className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-x-2">
                                        <Image
                                            width={40}
                                            height={40}
                                            src={user.image_url}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <p>{user.name}</p>
                                    </div>
                                    <Button
                                        variant="text"
                                        color="info"
                                        size="small"
                                        onClick={() =>
                                            router.push(`/user/${user.user_id}`)
                                        }
                                    >
                                        View profile
                                    </Button>
                                </div>
                            </Grid>
                        ))}
                    </>
                )}
            </Grid>
        </div>
    );
};

export default MobileFriend;
