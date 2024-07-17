import { DEFAULT_AVATAR } from "@/constants/global";
import {
    Box,
    Button,
    Grid,
    ImageList,
    ImageListItem,
    Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

const ListImage = () => {
    return (
        <Box>
            <Box className="p-4 mt-4 rounded-lg shadow-md bg-lite">
                <Grid container justifyContent={"space-between"}>
                    <Typography variant="h6" className="font-bold">
                        Photos
                    </Typography>
                    <Button
                        type="button"
                        variant="text"
                        color="info"
                        sx={{
                            textTransform: "none",
                        }}
                    >
                        See all photos
                    </Button>
                </Grid>
                <ImageList
                    sx={{ width: 380, height: 380 }}
                    cols={3}
                    rowHeight={128}
                >
                    <PhotoProvider>
                        {Array.from({ length: 9 }).map((_, index) => (
                            <ImageListItem key={index}>
                                <PhotoView src={DEFAULT_AVATAR}>
                                    <Image
                                        src={DEFAULT_AVATAR}
                                        width={128}
                                        height={128}
                                        className="object-cover w-[128px] h-[128px] rounded"
                                        alt="profile"
                                    ></Image>
                                </PhotoView>
                            </ImageListItem>
                        ))}
                    </PhotoProvider>
                </ImageList>
            </Box>
        </Box>
    );
};

export default ListImage;
