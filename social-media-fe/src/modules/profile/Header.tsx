import { Button, IconButton, Typography } from "@mui/material";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { UserResponse } from "@/types/userType";
const Header = ({ data }: { data: UserResponse }) => {
    const [currentTab, setCurrentTab] = React.useState(1);
    return (
        <div className="w-full h-full shadow-md bg-lite">
            <div className="w-full h-full max-w-[1080px] mx-auto">
                <div className="relative">
                    <div>
                        <Image
                            src={data.image_url}
                            width={1095}
                            height={500}
                            className="max-w-[1095px] h-[500px] rounded-lg object-cover"
                            alt="profile"
                        ></Image>
                        <Button
                            type="button"
                            variant="contained"
                            color="info"
                            className="absolute right-4 bottom-4"
                        >
                            <CameraAltRoundedIcon></CameraAltRoundedIcon>
                            <Typography>Chỉnh sửa ảnh bìa</Typography>
                        </Button>
                    </div>
                    <div>
                        <Image
                            src={data.image_url}
                            width={168}
                            height={168}
                            className="w-[168px] h-[168px] object-cover rounded-full absolute bottom-[-140px] left-8"
                            alt="profile"
                        ></Image>
                        <IconButton
                            color="info"
                            size="medium"
                            className="absolute bottom-[-140px] left-[140px] bg-grayf3 hover:bg-lite"
                        >
                            <CameraAltRoundedIcon></CameraAltRoundedIcon>
                        </IconButton>
                    </div>
                </div>
                <div className="ml-[220px] mt-3 mb-4 flex items-center justify-between">
                    <div>
                        <Typography variant="h4" className="font-bold">
                            {data.name}
                        </Typography>
                        <Link href={`/friends`}>
                            <span className="text-sm font-medium hover:underline text-text3">
                                24 bạn bè
                            </span>
                        </Link>
                        <div className="flex items-center justify-start mt-3 ">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Image
                                    key={index}
                                    src={`https://source.unsplash.com/random`}
                                    width={32}
                                    height={32}
                                    className="w-[32px] h-[32px] object-cover rounded-full 
                            first:ml-0 -ml-2 border-2 border-white z-10 cursor-pointer"
                                    alt="profile"
                                ></Image>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-x-2">
                        <Button type="button" variant="contained" color="info">
                            <AddIcon></AddIcon>
                            <Typography className="text-sm font-semibold">
                                Thêm vào tin
                            </Typography>
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            color="inherit"
                        >
                            <ModeEditOutlineIcon></ModeEditOutlineIcon>
                            <Typography className="text-sm font-semibold">
                                Chỉnh sửa trang cá nhân
                            </Typography>
                        </Button>
                    </div>
                </div>
                <hr className="w-full h-[1px] mt-6 bg-text4" />
                <div className="px-4 w-full h-[60px] mt-1 flex items-center justify-between">
                    <div className="flex items-center justify-start gap-x-3">
                        <button
                            className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                flex-shrink-0 ${
                    currentTab === 1
                        ? "border-b-4 border-secondary text-secondary"
                        : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                }`}
                        >
                            <Typography className="font-semibold">
                                Bài viết
                            </Typography>
                        </button>
                        <button
                            className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                flex-shrink-0 ${
                    currentTab === 2
                        ? "border-b-4 border-secondary text-secondary"
                        : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                }`}
                        >
                            <Typography className="font-semibold">
                                Bạn bè
                            </Typography>
                        </button>
                        <button
                            className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                flex-shrink-0 ${
                    currentTab === 3
                        ? "border-b-4 border-secondary text-secondary"
                        : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                }`}
                        >
                            <Typography className="font-semibold">
                                Ảnh
                            </Typography>
                        </button>
                        <button
                            className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                flex-shrink-0 ${
                    currentTab === 4
                        ? "border-b-4 border-secondary text-secondary"
                        : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                }`}
                        >
                            <Typography className="font-semibold">
                                Video
                            </Typography>
                        </button>
                        <button
                            className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                flex-shrink-0 ${
                    currentTab === 5
                        ? "border-b-4 border-secondary text-secondary"
                        : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                }`}
                        >
                            <Typography className="font-semibold">
                                Check in
                            </Typography>
                        </button>
                        <button
                            className={`flex items-center justify-center w-full max-w-[100px] h-[60px] 
                flex-shrink-0 ${
                    currentTab === 6
                        ? "border-b-4 border-secondary text-secondary"
                        : "hover:bg-text8 hover:bg-opacity-20 hover:rounded-md text-text8"
                }`}
                        >
                            <Typography className="font-semibold">
                                Xem thêm
                            </Typography>
                        </button>
                    </div>
                    <Button type="button" variant="contained" color="inherit">
                        <MoreHorizIcon></MoreHorizIcon>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;
