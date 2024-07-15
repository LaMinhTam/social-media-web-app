import { CommentData } from "@/types/postType";
import React from "react";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { formatOnlineTime } from "@/utils/conversation/messages/handleGroupMessage";

const PostComment = ({ data }: { data: CommentData }) => {
    console.log("PostComment ~ data:", data);
    if (!data) return null;
    return (
        <Box className="flex items-start mb-4">
            <Avatar src={data.author.image_url} className="mr-3" />
            <Box className="flex-1">
                <Box className="p-2 bg-gray-100 rounded-lg">
                    <Typography variant="body2" className="font-semibold">
                        {data.author.name}
                    </Typography>
                    <Typography variant="body2" className="whitespace-pre-line">
                        {data.content}
                    </Typography>
                    {data?.media && data.media.length > 0 && (
                        <PhotoProvider>
                            <Box className="mt-2">
                                {data.media.map((url, index) => (
                                    <PhotoView src={url}>
                                        <Image
                                            key={index}
                                            src={url}
                                            alt={`media-${index}`}
                                            width={100}
                                            height={100}
                                            className="object-cover rounded-lg"
                                        />
                                    </PhotoView>
                                ))}
                            </Box>
                        </PhotoProvider>
                    )}
                </Box>
                <Box className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                    <IconButton size="small">
                        <ThumbUpAltOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                        <ReplyOutlinedIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption">
                        {formatOnlineTime(data.create_at)} ago
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default PostComment;
