import { Box, CssBaseline, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SocialButtonGroup from "@/components/social/SocialButtonGroup";
import Avatar from "@mui/material/Avatar";
import { getAccessToken, getRefreshToken } from "@/utils/auth";
import getUserInfoFromCookie from "@/utils/auth/getUserInfoFromCookie";
import { useRouter } from "next/navigation";

const LayoutAuthentication = ({
    children,
    header,
    title,
}: {
    children: React.ReactNode;
    header: string;
    title: string;
}) => {
    const router = useRouter();
    useEffect(() => {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        const user = getUserInfoFromCookie();
        if (accessToken && refreshToken && user) {
            router.push("/");
        }
    }, []);

    return (
        <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: "url(./bg-authen.jpg)",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: (t) =>
                        t.palette.mode === "light"
                            ? t.palette.grey[50]
                            : t.palette.grey[900],
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {header}
                    </Typography>
                    <Box
                        sx={{
                            mt: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <SocialButtonGroup />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                        >
                            {title}
                        </Typography>
                    </Box>
                    {children}
                </Box>
            </Grid>
        </Grid>
    );
};

export default LayoutAuthentication;
