import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const ListFriend = () => {
    return (
        <Box className="p-4 mt-4 rounded-lg shadow-md bg-lite">
            <Grid container justifyContent={"space-between"}>
                <Typography variant="h6" className="font-bold">
                    Bạn bè
                </Typography>
                <Button
                    type="button"
                    variant="text"
                    color="info"
                    sx={{
                        textTransform: "none",
                    }}
                >
                    Xem tất cả bạn bè
                </Button>
            </Grid>
            <Grid container spacing={2}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <Grid item md={4} xs={4} key={index}>
                        <Image
                            src={`https://source.unsplash.com/random`}
                            width={100}
                            height={100}
                            className="w-[100px] h-[100px] object-cover"
                            alt="profile"
                        ></Image>
                        <Typography variant="body2" className="font-semibold">
                            Thong Dinh
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ListFriend;
