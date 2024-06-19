import {
    Badge,
    Box,
    Button,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, { useEffect, useState } from "react";
import OpenWithOutlinedIcon from "@mui/icons-material/OpenWithOutlined";
import SearchInput from "../common/SearchInput";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import { PopupState } from "material-ui-popup-state/hooks";
import { setShowChatModal } from "@/store/actions/commonSlice";
import { ConversationResponse } from "@/types/conversationType";
import {
    handleGetListConversation,
    handleGetListMessage,
} from "@/services/conversation.service";
import {
    setCurrentConversation,
    setCurrentSize,
    setListConversation,
} from "@/store/actions/conversationSlice";
import { useSocket } from "@/contexts/socket-context";
import handleReverseMessages from "@/utils/conversation/messages/handleReverseMessages";
import LoadingSpinner from "../loading/LoadingSpinner";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/constants/firebaseConfig";
import { handleRemoveUnreadMessage } from "@/utils/conversation/messages/handleRemoveUnreadMessage";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CreateGroupDialog from "@/modules/conversation/modal/group/CreateGroupDialog";

const ConversationModal = ({ popupState }: { popupState: PopupState }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>(
        {}
    );
    const triggerFetchingConversation = useSelector(
        (state: RootState) => state.conversation.triggerFetchingConversation
    );
    const { setMessages } = useSocket();
    const listConversation = useSelector(
        (state: RootState) => state.conversation.listConversation
    );
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const currentSize = useSelector(
        (state: RootState) => state.conversation.currentSize
    );
    const dispatch = useDispatch();

    const handleClickConversation = async (
        conversation: ConversationResponse
    ) => {
        const data = await handleGetListMessage(
            conversation.conversation_id,
            currentSize
        );
        if (data) {
            dispatch(setShowChatModal(true));
            dispatch(setCurrentConversation(conversation));
            dispatch(setCurrentSize(10));
            const messages = handleReverseMessages(data);
            setMessages(messages);
            const count = unreadCounts[conversation.conversation_id] || 0;
            if (count > 0) {
                handleRemoveUnreadMessage(
                    conversation.conversation_id,
                    currentUserProfile.user_id
                );
            }
            popupState.close();
        }
    };

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const response = await handleGetListConversation();
            if (response) {
                dispatch(setListConversation(response));
            }
            setLoading(false);
        }
        fetchData();
    }, [triggerFetchingConversation]);

    useEffect(() => {
        listConversation.forEach((conversation) => {
            const unreadTrackRef = doc(
                collection(db, "unreadTrack"),
                conversation.conversation_id
            );

            const unsubscribe = onSnapshot(unreadTrackRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const isUserUnread = Object.keys(
                        data.list_unread_message
                    ).some(
                        (key) => parseInt(key) === currentUserProfile.user_id
                    );
                    let unreadCount = 0;
                    if (isUserUnread) {
                        unreadCount =
                            data.list_unread_message[currentUserProfile.user_id]
                                .length;
                    }
                    // Update the state with the new count
                    setUnreadCounts((prevCounts) => ({
                        ...prevCounts,
                        [conversation.conversation_id]: unreadCount,
                    }));
                }
            });

            // Clean up the listener when the component unmounts
            return () => unsubscribe();
        });
    }, [listConversation]);

    return (
        <>
            <div className="w-[360px] h-full">
                <Box className="w-full h-full px-4 pt-3 pb-1">
                    <Stack
                        spacing={{ xs: 1, sm: 2 }}
                        direction="row"
                        useFlexGap
                        justifyContent={"space-between"}
                    >
                        <Typography
                            variant="h5"
                            className="font-bold"
                            color={"inherit"}
                        >
                            Đoạn chat
                        </Typography>
                        <Stack
                            spacing={{ xs: 1, sm: 2 }}
                            direction="row"
                            useFlexGap
                            flexWrap="wrap"
                        >
                            <Tooltip title="create group">
                                <IconButton
                                    size="medium"
                                    color="inherit"
                                    onClick={() => {
                                        setOpenCreateGroupDialog(true);
                                    }}
                                >
                                    <GroupAddIcon></GroupAddIcon>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Open messenger">
                                <IconButton size="medium" color="inherit">
                                    <OpenWithOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Box>
                <Box className="w-full h-full px-4 my-2">
                    <SearchInput
                        placeholder="Tìm kiếm trên Messenger"
                        inputProps={{ "aria-label": "Tìm kiếm trên Messenger" }}
                        onChange={() => {}}
                        value=""
                        className=""
                    ></SearchInput>
                </Box>
                <Box className="w-full h-full max-h-[500px] overflow-x-hidden overflow-y-auto custom-scrollbar">
                    {loading && <LoadingSpinner />}
                    {!loading &&
                        listConversation &&
                        listConversation.map((conversation) => {
                            const user = Object.values(
                                conversation.members
                            ).find(
                                (member) =>
                                    member.user_id !==
                                    currentUserProfile?.user_id
                            );
                            const unreadCount =
                                unreadCounts[conversation.conversation_id] || 0;
                            return (
                                <Box
                                    className="px-2"
                                    key={conversation.conversation_id}
                                >
                                    <Button
                                        className="flex items-center justify-start w-full h-full normal-case gap-x-2"
                                        color="inherit"
                                        variant="text"
                                        onClick={() =>
                                            handleClickConversation(
                                                conversation
                                            )
                                        }
                                    >
                                        <Image
                                            src={
                                                conversation.type === "GROUP"
                                                    ? conversation.image
                                                    : user?.image_url ||
                                                      "https://source.unsplash.com/random"
                                            }
                                            width={56}
                                            height={56}
                                            className="object-cover rounded-full w-14 h-14"
                                            alt="avatar"
                                        ></Image>
                                        <Box className="flex items-center justify-between flex-1">
                                            <Box className="flex flex-col items-start justify-center flex-1 gap-y-2">
                                                <Typography>
                                                    {conversation?.name}
                                                </Typography>
                                                <Box className="flex items-center justify-center gap-x-2">
                                                    <Typography>
                                                        Chao ban
                                                    </Typography>
                                                    <Typography>
                                                        &sdot; 19 giờ
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box className="pr-3">
                                                {unreadCount > 0 && (
                                                    <Badge
                                                        badgeContent={
                                                            unreadCount
                                                        }
                                                        color="error"
                                                    ></Badge>
                                                )}
                                            </Box>
                                        </Box>
                                    </Button>
                                </Box>
                            );
                        })}
                </Box>
                <Box className="z-50 flex items-center justify-center py-4 border-t shadow-md">
                    <Link
                        href={"/messages"}
                        className="font-semibold text-center cursor-pointer text-secondary hover:underline"
                    >
                        Xem tất cả trong Messenger
                    </Link>
                </Box>
            </div>
            {openCreateGroupDialog && (
                <CreateGroupDialog
                    openCreateGroupDialog={openCreateGroupDialog}
                    setOpenCreateGroupDialog={setOpenCreateGroupDialog}
                ></CreateGroupDialog>
            )}
        </>
    );
};

export default ConversationModal;
