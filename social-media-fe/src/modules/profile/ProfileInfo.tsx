import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";

const ProfileInfo = () => {
    return (
        <Box className="p-4 rounded-lg shadow-md bg-lite">
            <Typography variant="h6" className="font-bold">
                Giới thiệu
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
                Thêm tiểu sử
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
                Chỉnh sửa chi tiết
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
                Thêm nội dung đáng chú ý
            </Button>
        </Box>
    );
};

export default ProfileInfo;
