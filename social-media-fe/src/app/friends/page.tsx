"use client";
import UserCard from "@/components/card/UserCard";
import LayoutDashboard from "@/layout/LayoutDashboard";
import LayoutFriends from "@/layout/LayoutFriends";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";
import { Box, Button, Grid, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import React from "react";
import { useRouter } from "next/navigation";

const Friends = () => {
    const [randomNumber, setRandomNumber] = React.useState(8);
    const router = useRouter();
    return (
        <RequiredAuthLayout>
            <LayoutDashboard>
                <LayoutFriends>
                    <Box className="p-5">
                        <Box className="flex items-center justify-between">
                            <Typography variant="h6" fontWeight={600}>
                                Lời mời kết bạn
                            </Typography>
                            <Button
                                type="button"
                                color="info"
                                className="normal-case"
                                variant="text"
                                onClick={() => router.push("/friends/request")}
                            >
                                <Typography>Xem tất cả</Typography>
                            </Button>
                        </Box>
                        <Grid
                            container
                            spacing={{ xs: 1, md: 1 }}
                            columns={{ xs: 4, sm: 8, md: 12 }}
                        >
                            {Array.from(Array(randomNumber)).map((_, index) => (
                                <Grid item xs={12} sm={4} md={3} key={index}>
                                    <UserCard></UserCard>
                                </Grid>
                            ))}
                        </Grid>
                        <Box className="flex items-center justify-center mt-5">
                            <Button
                                type="button"
                                color="info"
                                variant="text"
                                fullWidth
                                endIcon={<ArrowDropDownIcon />}
                                onClick={() =>
                                    setRandomNumber(randomNumber + 8)
                                }
                            >
                                Xem thêm
                            </Button>
                        </Box>
                    </Box>
                </LayoutFriends>
            </LayoutDashboard>
        </RequiredAuthLayout>
    );
};

export default Friends;
