import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Image from "next/image";
import { FriendRequestData } from "@/types/userType";
import {
    handleAcceptFriendRequest,
    handleRevokeFriendRequest,
} from "@/services/friend.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import {
    setShowChatModal,
    setTriggerReFetchingRelationship,
} from "@/store/actions/commonSlice";
import { setUserClicked } from "@/store/actions/userSlice";
import { useRouter } from "next/navigation";
import { DEFAULT_AVATAR } from "@/constants/global";

export default function UserCard({
    user,
    type = "dashboard",
}: {
    user: FriendRequestData;
    type?: string;
}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const triggerReFetchingRelationship = useSelector(
        (state: RootState) => state.common.triggerReFetchingRelationship
    );
    const [btnTopLoading, setBtnTopLoading] = React.useState(false);
    const [btnBottomLoading, setBtnBottomLoading] = React.useState(false);
    const topBtnContent = (type: string) => {
        switch (type) {
            case "friend":
                return "View profile";
            case "receive":
                return "Accept";
            case "request":
                return "View profile";
            default:
                return "View profile";
        }
    };

    const bottomBtnContent = (type: string) => {
        switch (type) {
            case "friend":
                return "Chat";
            case "receive":
                return "Reject";
            case "request":
                return "Cancel";
            default:
                return "Chat";
        }
    };

    const handleTopBtnAction = async (type: string) => {
        setBtnTopLoading(true);
        switch (type) {
            case "friend":
                router.push(`/user/${user.user_id}`);
                setBtnTopLoading(false);
                return;
            case "receive":
                await handleAcceptFriendRequest(
                    user.user_id,
                    user.friend_request_id
                );
                setBtnTopLoading(false);
                dispatch(
                    setTriggerReFetchingRelationship(
                        !triggerReFetchingRelationship
                    )
                );
                return;
            case "request":
                router.push(`/user/${user.user_id}`);
                setBtnTopLoading(false);
                return;
            default:
                router.push(`/user/${user.user_id}`);
                return;
        }
    };

    const handleBottomBtnAction = async (type: string) => {
        setBtnBottomLoading(false);
        switch (type) {
            case "friend":
                // dispatch(setShowChatModal(true));
                // dispatch(setUserClicked(user));
                setBtnBottomLoading(false);
                return;
            case "receive":
                await handleRevokeFriendRequest(
                    user.user_id,
                    user.friend_request_id
                );
                setBtnBottomLoading(false);
                dispatch(
                    setTriggerReFetchingRelationship(
                        !triggerReFetchingRelationship
                    )
                );
                return;
            case "request":
                await handleRevokeFriendRequest(
                    user.user_id,
                    user.friend_request_id
                );
                setBtnBottomLoading(false);
                dispatch(
                    setTriggerReFetchingRelationship(
                        !triggerReFetchingRelationship
                    )
                );
                return;
            default:
                return;
        }
    };

    return (
        <Card sx={{ maxWidth: 250 }}>
            <Image
                src={user.image_url || DEFAULT_AVATAR}
                width="250"
                height="222"
                alt="avatar"
                className="object-cover w-full h-[222px] rounded"
            />
            <CardContent>
                <Typography variant="h6" className="text-lg font-semibold">
                    {user.name}
                </Typography>
                <Box className="flex items-center justify-start gap-x-2">
                    <Box className="flex items-center justify-start">
                        {Array.from(Array(2)).map((_, index) => (
                            <Image
                                key={index}
                                src={DEFAULT_AVATAR}
                                width={16}
                                height={16}
                                alt="avatar"
                                className="w-4 h-4 -mr-1 border-2 border-white rounded-full"
                            />
                        ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        2 mutual friends
                    </Typography>
                </Box>
            </CardContent>
            <CardActions className="flex flex-col gap-y-3">
                <Button
                    size="medium"
                    type="button"
                    color="info"
                    variant="contained"
                    fullWidth
                    disabled={btnTopLoading}
                    onClick={() => handleTopBtnAction(type)}
                >
                    {topBtnContent(type)}
                </Button>
                <Button
                    size="medium"
                    type="button"
                    color="inherit"
                    variant="contained"
                    fullWidth
                    disabled={btnBottomLoading}
                    onClick={() => handleBottomBtnAction(type)}
                >
                    {bottomBtnContent(type)}
                </Button>
            </CardActions>
        </Card>
    );
}
