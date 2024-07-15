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
                    {Array.from({ length: 9 }).map((_, index) => (
                        <ImageListItem key={index}>
                            <Image
                                src={`https://source.unsplash.com/random`}
                                width={128}
                                height={128}
                                className="object-cover w-[128px] h-[128px] rounded"
                                alt="profile"
                            ></Image>
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </Box>
    );
};

export default ListImage;
