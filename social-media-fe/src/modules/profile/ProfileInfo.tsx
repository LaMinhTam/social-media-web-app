import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";

const ProfileInfo = () => {
    return (
        <Box className="p-4 rounded-lg shadow-md bg-lite">
            <Typography variant="h6" className="font-bold">
                Intro
            </Typography>
            <Button
                type="button"
                variant="contained"
                color="info"
                fullWidth
                sx={{
                    textTransform: "none",
                }}
                className="p-2 mt-4 text-sm font-semibold"
            >
                Add bio
            </Button>
            <Button
                type="button"
                variant="contained"
                color="info"
                fullWidth
                sx={{
                    textTransform: "none",
                }}
                className="p-2 mt-4 text-sm font-semibold"
            >
                Edit details
            </Button>
            <Button
                type="button"
                variant="contained"
                color="info"
                fullWidth
                sx={{
                    textTransform: "none",
                }}
                className="p-2 mt-4 text-sm font-semibold"
            >
                Add features
            </Button>
        </Box>
    );
};

export default ProfileInfo;
