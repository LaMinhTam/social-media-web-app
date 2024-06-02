import { Button, Grid } from "@mui/material";
import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { FACEBOOK_AUTH_URL, GOOGLE_AUTH_URL } from "@/constants/global";

const SocialButtonGroup = () => {
    return (
        <Grid
            container
            sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                gap: 2,
            }}
        >
            <Grid item>
                <Button
                    variant="outlined"
                    href={GOOGLE_AUTH_URL}
                    title="Google"
                    sx={{
                        px: 4,
                        textTransform: "none",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        ":hover": {
                            backgroundColor: "secondary.main",
                            color: "white",
                        },
                    }}
                >
                    <GoogleIcon />
                    <span>Google</span>
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="outlined"
                    href={FACEBOOK_AUTH_URL}
                    title="Facebook"
                    sx={{
                        px: 4,
                        textTransform: "none",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        ":hover": {
                            backgroundColor: "secondary.main",
                            color: "white",
                        },
                    }}
                >
                    <FacebookIcon />
                    <span>Facebook</span>
                </Button>
            </Grid>
        </Grid>
    );
};

export default SocialButtonGroup;
