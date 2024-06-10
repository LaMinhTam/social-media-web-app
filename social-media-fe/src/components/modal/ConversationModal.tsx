import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";
import OpenWithOutlinedIcon from "@mui/icons-material/OpenWithOutlined";
import SearchInput from "../common/SearchInput";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import { PopupState } from "material-ui-popup-state/hooks";
import { setShowChatModal } from "@/store/actions/commonSlice";
import { setUserClicked } from "@/store/actions/userSlice";

const ConversationModal = ({ popupState }: { popupState: PopupState }) => {
    const relationshipUsers = useSelector(
        (state: RootState) => state.user.relationshipUsers
    );
    const dispatch = useDispatch();
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
                            <IconButton size="medium" color="inherit">
                                <MoreHorizIcon />
                            </IconButton>
                            <IconButton size="medium" color="inherit">
                                <OpenWithOutlinedIcon />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Box>
                <Box className="w-full h-full px-4 my-2">
                    <SearchInput
                        placeholder="Tìm kiếm trên Messenger"
                        inputProps={{ "aria-label": "Tìm kiếm trên Messenger" }}
                        onClick={() => {}}
                        onChange={() => {}}
                        value=""
                        className=""
                    ></SearchInput>
                </Box>
                <Box className="w-full h-full max-h-[500px] overflow-x-hidden overflow-y-auto">
                    {relationshipUsers &&
                        relationshipUsers.friends &&
                        Object.values(relationshipUsers.friends).map((user) => (
                            <Box className="px-2" key={user.user_id}>
                                <Button
                                    className="flex items-center justify-start w-full h-full normal-case gap-x-2"
                                    color="inherit"
                                    variant="text"
                                    onClick={() => {
                                        dispatch(setShowChatModal(true));
                                        dispatch(setUserClicked(user));
                                        popupState.close();
                                    }}
                                >
                                    <Image
                                        src={user.image_url}
                                        width={56}
                                        height={56}
                                        className="object-cover rounded-full w-14 h-14"
                                        alt="avatar"
                                    ></Image>
                                    <Box className="flex flex-col items-start justify-center flex-1 gap-y-2">
                                        <Typography>{user.name}</Typography>
                                        <Box className="flex items-center justify-center gap-x-2">
                                            <Typography>Chao ban</Typography>
                                            <Typography>
                                                &sdot; 19 giờ
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Button>
                            </Box>
                        ))}
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
        </>
    );
};

export default ConversationModal;
