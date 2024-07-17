import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto";
import { useDispatch } from "react-redux";
import { setOpenCreatePostDialog } from "@/store/actions/postSlice";
import { DEFAULT_AVATAR } from "@/constants/global";
const PostHeader = () => {
    const dispatch = useDispatch();
    return (
        <Box className="p-4 rounded-lg shadow-md bg-lite">
            <div className="flex items-center justify-center gap-x-2">
                <Image
                    src={DEFAULT_AVATAR}
                    width={40}
                    height={40}
                    className="object-cover w-10 h-10 rounded-full"
                    alt="profile"
                ></Image>
                <div
                    onClick={() => dispatch(setOpenCreatePostDialog(true))}
                    className="w-full h-[48px] cursor-pointer bg-text6 flex items-center justify-start px-4 rounded-full"
                >
                    <span>What's on your mind?</span>
                </div>
            </div>
            <hr className="w-full h-[1px] mt-6 bg-text4" />
            <div className="flex items-center justify-between mt-4">
                <Button
                    type="button"
                    variant="text"
                    color="error"
                    className="flex items-center normal-case gap-x-2"
                >
                    <VideoCameraFrontIcon></VideoCameraFrontIcon>
                    <Typography className="font-semibold">
                        Live video
                    </Typography>
                </Button>
                <Button
                    type="button"
                    variant="text"
                    color="success"
                    className="flex items-center normal-case gap-x-2"
                >
                    <InsertPhotoIcon></InsertPhotoIcon>
                    <Typography className="font-semibold">
                        Photo/video
                    </Typography>
                </Button>
                <Button
                    type="button"
                    variant="text"
                    color="info"
                    className="flex items-center normal-case gap-x-2"
                >
                    <AssistantPhotoIcon></AssistantPhotoIcon>
                    <Typography className="font-semibold">
                        Live event
                    </Typography>
                </Button>
            </div>
        </Box>
    );
};

export default PostHeader;
