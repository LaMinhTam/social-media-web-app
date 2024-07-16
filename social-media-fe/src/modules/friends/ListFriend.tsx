import UserCard from "@/components/card/UserCard";
import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { FriendRequestData } from "@/types/userType";
const ListFriend = ({
    router,
    data,
    type,
}: {
    router: AppRouterInstance;
    data: Record<string, FriendRequestData>;
    type: string;
}) => {
    const [randomNumber, setRandomNumber] = React.useState(8);
    if (!data) return null;
    return (
        <>
            <Box className="flex items-center justify-between">
                <Typography variant="h6" fontWeight={600}>
                    {type === "friend" && "Friends"}
                    {type === "receive" && "Friend requests"}
                    {type === "request" && "Sent requests"}
                </Typography>
                <Button
                    type="button"
                    color="info"
                    className="normal-case"
                    variant="text"
                    onClick={() => router.push("/friends/request")}
                >
                    <Typography>Watch all</Typography>
                </Button>
            </Box>
            <Grid
                container
                spacing={{ xs: 1, md: 1 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {data &&
                    Object.values(data)
                        .slice(0, randomNumber)
                        .map((user) => (
                            <Grid item xs={4} sm={4} md={3} key={user.user_id}>
                                <UserCard user={user} type={type} />
                            </Grid>
                        ))}
            </Grid>
            {data && randomNumber < Object.values(data).length && (
                <Box className="flex items-center justify-center mt-5">
                    <Button
                        type="button"
                        color="info"
                        variant="text"
                        fullWidth
                        endIcon={<ArrowDropDownIcon />}
                        onClick={() => setRandomNumber(randomNumber + 8)}
                    >
                        View more
                    </Button>
                </Box>
            )}
        </>
    );
};

export default ListFriend;
