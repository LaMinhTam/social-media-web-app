import {
    Button,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Link from "next/link";
import Image from "next/image";
import React, { useMemo } from "react";
import { Member } from "@/types/conversationType";
import UpdateCoverDialog from "./UpdateCoverDialog";
import EditProfileDialog from "./EditProfileDialog";
import {
    handleAcceptFriendRequest,
    handleFollowUser,
    handleRemoveFriend,
    handleRevokeFriendRequest,
    handleSendFriendRequest,
} from "@/services/friend.service";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import { useRouter } from "next/navigation";
import { DEFAULT_AVATAR, DEFAULT_COVER } from "@/constants/global";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { FriendRequestData } from "@/types/userType";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { setTriggerReFetchingRelationship } from "@/store/actions/commonSlice";
const Header = ({ data, type = "me" }: { data: Member; type?: string }) => {
    const isMobile = useSelector((state: RootState) => state.common.isMobile);
    const dispatch = useDispatch();
    const router = useRouter();
    const relationshipUsers = useSelector(
        (state: RootState) => state.user.relationshipUsers
    );
    let count = 0;
    if (Object.values(relationshipUsers.friends ?? {}).length > 0) {
        count = Object.values(relationshipUsers.friends).length;
    }
    const triggerReFetchingRelationship = useSelector(
        (state: RootState) => state.common.triggerReFetchingRelationship
    );
    const [actionLoading, setActionLoading] = React.useState(false);
    const [textContent, setTextContent] = React.useState("Follow");
    const [currentTab, setCurrentTab] = React.useState(1);
    const [openUpdateCoverDialog, setOpenUpdateCoverDialog] =
        React.useState(false);
    const [openUpdateAvatarDialog, seOpenUpdateAvatarDialog] =
        React.useState(false);
    const [openEditProfileDialog, setOpenEditProfileDialog] =
        React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const handleFollow = async () => {
        setLoading(true);
        await handleFollowUser(data.user_id);
        setTextContent("Following");
        setLoading(false);
    };

    const handleAddFriend = async () => {
        setActionLoading(true);
        await handleSendFriendRequest(data.user_id);
        dispatch(
            setTriggerReFetchingRelationship(!triggerReFetchingRelationship)
        );
        setActionLoading(false);
    };

    const handleAccept = async () => {
        setActionLoading(true);
        const user = relationshipUsers.receive_request[data.user_id];
        await handleAcceptFriendRequest(user.user_id, user.friend_request_id);
        dispatch(
            setTriggerReFetchingRelationship(!triggerReFetchingRelationship)
        );
        setActionLoading(false);
    };

    const handleReject = async () => {
        setActionLoading(true);
        const user = relationshipUsers.receive_request[data.user_id];
        await handleRevokeFriendRequest(user.user_id, user.friend_request_id);
        dispatch(
            setTriggerReFetchingRelationship(!triggerReFetchingRelationship)
        );
        setActionLoading(false);
    };

    const handleUnfriend = async () => {
        setActionLoading(true);
        const user = relationshipUsers.friends[data.user_id];
        await handleRemoveFriend(user.user_id, user.friend_request_id);
        dispatch(
            setTriggerReFetchingRelationship(!triggerReFetchingRelationship)
        );
        setActionLoading(false);
    };

    const handleRevokeRequest = async () => {
        setActionLoading(true);
        const user = relationshipUsers.send_request[data.user_id];
        await handleRevokeFriendRequest(user.user_id, user.friend_request_id);
        dispatch(
            setTriggerReFetchingRelationship(!triggerReFetchingRelationship)
        );
        setActionLoading(false);
    };

    const relationship = useMemo(() => {
        const isInFriend =
            Object.keys(relationshipUsers.friends ?? {}).length > 0 &&
            Object.keys(relationshipUsers.friends).includes(
                data.user_id.toString()
            );
        const isSentRequest =
            Object.keys(relationshipUsers.send_request ?? {}).length > 0 &&
            Object.keys(relationshipUsers.send_request).includes(
                data.user_id.toString()
            );
        const isReceiveRequest =
            Object.keys(relationshipUsers.receive_request ?? {}).length > 0 &&
            Object.keys(relationshipUsers.receive_request).includes(
                data.user_id.toString()
            );
        if (isInFriend) return "IN_FRIEND";
        else if (isSentRequest) return "WAIT_USER_ACCEPT";
        else if (isReceiveRequest) return "WAIT_ACCEPT";
        else return "GUEST";
    }, [relationshipUsers.friends, data.user_id]);
    return (
        <>
            <div className="w-full h-full shadow-md bg-lite">
                <div className="w-full h-full max-w-[1080px] mx-auto">
                    <div className="relative">
                        <div>
                            <PhotoProvider>
                                <PhotoView src={data.cover}>
                                    <Image
                                        src={data.cover || DEFAULT_COVER}
                                        width={1095}
                                        height={isMobile ? 375 : 500}
                                        className="max-w-[1095px] w-full md:h-[500px] h-[375px] rounded-lg object-cover cursor-pointer"
                                        alt="profile"
                                    ></Image>
                                </PhotoView>
                            </PhotoProvider>
                            {type === "me" && (
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="info"
                                    className="absolute normal-case right-4 bottom-4"
                                    onClick={() =>
                                        setOpenUpdateCoverDialog(true)
                                    }
                                >
                                    <CameraAltRoundedIcon></CameraAltRoundedIcon>
                                    <Typography>Edit cover photo</Typography>
                                </Button>
                            )}
                        </div>
                        <div>
                            <PhotoProvider>
                                <PhotoView
                                    src={data.image_url || DEFAULT_AVATAR}
                                >
                                    <Image
                                        src={data.image_url}
                                        width={168}
                                        height={168}
                                        className="cursor-pointer w-[142px] h-[142px] md:w-[168px] md:h-[168px] object-cover rounded-full absolute md:bottom-[-140px] bottom-[-80px] left-8"
                                        alt="profile"
                                    ></Image>
                                </PhotoView>
                            </PhotoProvider>
                            {type === "me" && (
                                <IconButton
                                    color="info"
                                    size="medium"
                                    className="absolute md:bottom-[-140px] bottom-[-80px] left-[140px] bg-grayf3 hover:bg-lite"
                                    onClick={() =>
                                        seOpenUpdateAvatarDialog(true)
                                    }
                                >
                                    <CameraAltRoundedIcon></CameraAltRoundedIcon>
                                </IconButton>
                            )}
                        </div>
                    </div>
                    <div
                        className={`md:ml-[220px] ml-4 md:mt-3 mt-20 mb-4 md:flex items-center justify-between ${
                            isMobile ? "flex-col" : ""
                        }`}
                    >
                        <div>
                            <Typography variant="h4" className="font-bold">
                                {data.name}
                            </Typography>
                            <Link href={`/friends`}>
                                <span className="text-sm font-medium hover:underline text-text3">
                                    {type === "user"
                                        ? "24 friends"
                                        : `${count} friends`}
                                </span>
                            </Link>
                            <div className="flex items-center justify-start mt-3">
                                {type === "user" &&
                                    Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <Image
                                                key={index}
                                                src={DEFAULT_AVATAR}
                                                width={32}
                                                height={32}
                                                className="w-[32px] h-[32px] object-cover rounded-full 
                                first:ml-0 -ml-2 border-2 border-white z-10 cursor-pointer"
                                                alt="profile"
                                            ></Image>
                                        )
                                    )}
                                {type === "me" &&
                                    Object.values(
                                        relationshipUsers.friends ?? {}
                                    ).length > 0 &&
                                    Object.values(
                                        relationshipUsers.friends
                                    ).map((user: FriendRequestData) => (
                                        <Image
                                            key={user.user_id}
                                            src={user.image_url}
                                            width={32}
                                            height={32}
                                            className="w-[32px] h-[32px] object-cover rounded-full 
                                first:ml-0 -ml-2 border-2 border-white z-10 cursor-pointer"
                                            alt="profile"
                                            onClick={() =>
                                                router.push(
                                                    `/user/${user.user_id}`
                                                )
                                            }
                                        ></Image>
                                    ))}
                            </div>
                        </div>
                        <div className="flex items-center md:justify-center gap-x-2">
                            {type === "me" && (
                                <>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="info"
                                        className="normal-case"
                                    >
                                        <AddIcon></AddIcon>
                                        <Typography className="text-sm font-semibold">
                                            Add to story
                                        </Typography>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="inherit"
                                        className="normal-case"
                                        onClick={() =>
                                            setOpenEditProfileDialog(true)
                                        }
                                    >
                                        <ModeEditOutlineIcon></ModeEditOutlineIcon>
                                        <Typography className="text-sm font-semibold">
                                            Edit profile
                                        </Typography>
                                    </Button>
                                </>
                            )}
                            {type === "user" && (
                                <>
                                    {relationship === "WAIT_ACCEPT" && (
                                        <>
                                            <Button
                                                type="button"
                                                variant="contained"
                                                color={"info"}
                                                className="mt-2 normal-case"
                                                onClick={handleAccept}
                                                startIcon={<AddIcon />}
                                                disabled={actionLoading}
                                            >
                                                <Typography>Accept</Typography>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="contained"
                                                color={"warning"}
                                                className="mt-2 normal-case"
                                                onClick={handleReject}
                                                startIcon={<PersonRemoveIcon />}
                                                disabled={actionLoading}
                                            >
                                                <Typography>Reject</Typography>
                                            </Button>
                                        </>
                                    )}
                                    {relationship === "IN_FRIEND" && (
                                        <>
                                            <Button
                                                type="button"
                                                variant="contained"
                                                color={"warning"}
                                                className="mt-2 normal-case"
                                                onClick={handleUnfriend}
                                                startIcon={<PersonRemoveIcon />}
                                                disabled={actionLoading}
                                            >
                                                <Typography>
                                                    Unfriend
                                                </Typography>
                                            </Button>
                                        </>
                                    )}
                                    {relationship === "GUEST" && (
                                        <>
                                            <Button
                                                type="button"
                                                variant="contained"
                                                color={"info"}
                                                className="mt-2 normal-case"
                                                onClick={handleAddFriend}
                                                startIcon={<AddIcon />}
                                                disabled={actionLoading}
                                            >
                                                <Typography>
                                                    Add friend
                                                </Typography>
                                            </Button>
                                        </>
                                    )}
                                    {relationship === "WAIT_USER_ACCEPT" && (
                                        <>
                                            <Button
                                                type="button"
                                                variant="contained"
                                                color={"warning"}
                                                className="mt-2 normal-case"
                                                onClick={handleRevokeRequest}
                                                startIcon={<PersonRemoveIcon />}
                                                disabled={actionLoading}
                                            >
                                                <Typography>
                                                    Revoke friend request
                                                </Typography>
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="info"
                                        className="mt-2 normal-case"
                                        onClick={handleFollow}
                                        disabled={loading}
                                    >
                                        <AddIcon></AddIcon>
                                        <Typography className="text-sm font-semibold">
                                            {loading ? (
                                                <LoadingSpinner></LoadingSpinner>
                                            ) : (
                                                textContent
                                            )}
                                        </Typography>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <hr className="w-full h-[1px] mt-6 bg-text4" />
                    <div className="px-4 w-full h-[60px] mt-1 flex items-center justify-between">
                        <div className="flex items-center justify-start gap-x-3">
                            <button
                                className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                    flex-shrink-0 ${
                        currentTab === 1
                            ? "border-b-4 border-secondary text-secondary"
                            : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                    }`}
                            >
                                <Typography className="font-semibold">
                                    Posts
                                </Typography>
                            </button>
                            <button
                                className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                    flex-shrink-0 ${
                        currentTab === 2
                            ? "border-b-4 border-secondary text-secondary"
                            : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                    }`}
                            >
                                <Typography className="font-semibold">
                                    Friends
                                </Typography>
                            </button>
                            {isMobile ? (
                                <div></div>
                            ) : (
                                <>
                                    <button
                                        className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                    flex-shrink-0 ${
                        currentTab === 3
                            ? "border-b-4 border-secondary text-secondary"
                            : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                    }`}
                                    >
                                        <Typography className="font-semibold">
                                            Photos
                                        </Typography>
                                    </button>
                                    <button
                                        className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                    flex-shrink-0 ${
                        currentTab === 4
                            ? "border-b-4 border-secondary text-secondary"
                            : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                    }`}
                                    >
                                        <Typography className="font-semibold">
                                            Videos
                                        </Typography>
                                    </button>
                                    <button
                                        className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                    flex-shrink-0 ${
                        currentTab === 5
                            ? "border-b-4 border-secondary text-secondary"
                            : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                    }`}
                                    >
                                        <Typography className="font-semibold">
                                            Check-ins
                                        </Typography>
                                    </button>
                                    <button
                                        className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                    flex-shrink-0 ${
                        currentTab === 6
                            ? "border-b-4 border-secondary text-secondary"
                            : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                    }`}
                                    >
                                        <Typography className="font-semibold">
                                            More
                                        </Typography>
                                    </button>
                                </>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="contained"
                            color="inherit"
                        >
                            <MoreHorizIcon></MoreHorizIcon>
                        </Button>
                    </div>
                </div>
            </div>
            {openUpdateCoverDialog && (
                <UpdateCoverDialog
                    openUpdateCoverDialog={openUpdateCoverDialog}
                    setOpenUpdateCoverDialog={setOpenUpdateCoverDialog}
                ></UpdateCoverDialog>
            )}
            {openUpdateAvatarDialog && (
                <UpdateCoverDialog
                    openUpdateCoverDialog={openUpdateAvatarDialog}
                    setOpenUpdateCoverDialog={seOpenUpdateAvatarDialog}
                    type="avatar"
                ></UpdateCoverDialog>
            )}
            {openEditProfileDialog && (
                <EditProfileDialog
                    openEditProfileDialog={openEditProfileDialog}
                    setOpenEditProfileDialog={setOpenEditProfileDialog}
                ></EditProfileDialog>
            )}
        </>
    );
};

export default Header;
