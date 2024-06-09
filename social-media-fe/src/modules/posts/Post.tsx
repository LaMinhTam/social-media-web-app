import { Box, Button, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";

const Post = () => {
    return (
        <Box className="p-4 mt-4 rounded-lg shadow-md bg-lite">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Image
                        src={`https://source.unsplash.com/random`}
                        width={40}
                        height={40}
                        className="object-cover w-10 h-10 rounded-full"
                        alt="profile"
                    ></Image>
                    <div>
                        <Typography className="font-semibold">
                            Thong Dinh
                        </Typography>
                        <Typography className="text-sm">2 giờ trước</Typography>
                    </div>
                </div>
                <Button type="button" variant="text" color="info">
                    <MoreHorizIcon></MoreHorizIcon>
                </Button>
            </div>
            <div className="mt-4">
                <Typography>Hello world</Typography>
            </div>
            <div className="mt-4">
                <Image
                    src={`https://source.unsplash.com/random`}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full rounded-lg"
                    alt="profile"
                ></Image>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center justify-center gap-x-1">
                        <IconButton>
                            <InsertPhotoIcon></InsertPhotoIcon>
                        </IconButton>
                        <Typography>24</Typography>
                    </div>
                    <div className="flex items-center justify-center gap-x-1">
                        <IconButton>
                            <VideoCameraFrontIcon></VideoCameraFrontIcon>
                        </IconButton>
                        <Typography>24</Typography>
                    </div>
                </div>
                <Button type="button" variant="text" color="inherit">
                    <Typography>24 bình luận</Typography>
                </Button>
            </div>
        </Box>
    );
};

export default Post;
