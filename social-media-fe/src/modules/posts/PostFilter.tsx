import { Box, Button, Typography } from "@mui/material";
import React from "react";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import GridViewIcon from "@mui/icons-material/GridView";

const PostFilter = () => {
    const [currentTab, setCurrentTab] = React.useState(1);
    return (
        <Box className="p-4 mt-4 rounded-lg shadow-md bg-lite">
            <Box className="flex items-center justify-between">
                <Typography className="font-semibold" variant="h6">
                    Bài viết
                </Typography>
                <Box className="flex items-center justify-center gap-x-2">
                    <Button
                        type="button"
                        variant="contained"
                        color="inherit"
                        sx={{
                            textTransform: "none",
                        }}
                    >
                        <TuneSharpIcon></TuneSharpIcon>
                        <Typography>Bộ lọc</Typography>
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        color="inherit"
                        sx={{
                            textTransform: "none",
                        }}
                    >
                        <SettingsIcon></SettingsIcon>
                        <Typography>Quản lý bài viết</Typography>
                    </Button>
                </Box>
            </Box>
            <hr className="w-full h-[1px] mt-6 bg-text4" />
            <Box className="flex items-center justify-between">
                <button
                    className={`flex items-center justify-center w-full max-w-[280px] h-[60px] 
        flex-shrink-0 ${
            currentTab === 1
                ? "border-b-4 border-secondary text-secondary"
                : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
        }`}
                >
                    <MenuIcon></MenuIcon>
                    <Typography className="font-semibold">
                        Xem theo danh sách
                    </Typography>
                </button>
                <button
                    className={`flex items-center justify-center w-full max-w-[280px] h-[60px] 
        flex-shrink-0 ${
            currentTab === 2
                ? "border-b-4 border-secondary text-secondary"
                : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
        }`}
                >
                    <GridViewIcon></GridViewIcon>
                    <Typography className="font-semibold">
                        Chế độ xem lưới
                    </Typography>
                </button>
            </Box>
        </Box>
    );
};

export default PostFilter;
