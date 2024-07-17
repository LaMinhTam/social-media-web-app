import { RootState } from "@/store/configureStore";
import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const ListFriend = ({ type = "me" }: { type?: string }) => {
    const relationshipUsers = useSelector(
        (state: RootState) => state.user.relationshipUsers
    );
    const router = useRouter();
    return (
        <Box className="p-4 mt-4 rounded-lg shadow-md bg-lite">
            <Grid container justifyContent={"space-between"}>
                <Typography variant="h6" className="font-bold">
                    Friends
                </Typography>
                <Button
                    type="button"
                    variant="text"
                    color="info"
                    sx={{
                        textTransform: "none",
                    }}
                >
                    See all friends
                </Button>
            </Grid>
            <Grid container spacing={2}>
                {type === "me" &&
                    Object.keys(relationshipUsers).length > 0 &&
                    Object.values(relationshipUsers.friends).map((user) => (
                        <Grid item md={4} xs={4} key={user.user_id}>
                            <Image
                                src={user.image_url}
                                width={100}
                                height={100}
                                className="w-[100px] h-[100px] object-cover cursor-pointer"
                                alt="profile"
                                onClick={() =>
                                    router.push(`/user/${user.user_id}`)
                                }
                            ></Image>
                            <Typography
                                variant="body2"
                                className="font-semibold cursor-pointer"
                                onClick={() =>
                                    router.push(`/user/${user.user_id}`)
                                }
                            >
                                {user.name}
                            </Typography>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
};

export default ListFriend;
