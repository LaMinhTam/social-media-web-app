import { Button, IconButton, Typography } from "@mui/material";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Member } from "@/types/conversationType";
import UpdateCoverDialog from "./UpdateCoverDialog";
import EditProfileDialog from "./EditProfileDialog";
const Header = ({ data }: { data: Member }) => {
    const [currentTab, setCurrentTab] = React.useState(1);
    const [openUpdateCoverDialog, setOpenUpdateCoverDialog] =
        React.useState(false);
    const [openUpdateAvatarDialog, seOpenUpdateAvatarDialog] =
        React.useState(false);
    const [openEditProfileDialog, setOpenEditProfileDialog] =
        React.useState(false);
    return (
        <>
            <div className="w-full h-full shadow-md bg-lite">
                <div className="w-full h-full max-w-[1080px] mx-auto">
                    <div className="relative">
                        <div>
                            <Image
                                src={data.cover}
                                width={1095}
                                height={500}
                                className="max-w-[1095px] h-[500px] rounded-lg object-cover"
                                alt="profile"
                            ></Image>
                            <Button
                                type="button"
                                variant="contained"
                                color="info"
                                className="absolute normal-case right-4 bottom-4"
                                onClick={() => setOpenUpdateCoverDialog(true)}
                            >
                                <CameraAltRoundedIcon></CameraAltRoundedIcon>
                                <Typography>Edit cover photo</Typography>
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
                                onClick={() => seOpenUpdateAvatarDialog(true)}
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
                                    24 friends
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
                            <Button
                                type="button"
                                variant="contained"
                                color="info"
                                className="normal-case"
                            >
                                <AddIcon></AddIcon>
                                <Typography className="text-sm font-semibold">
                                    Add to story
                                </Typography>
                            </Button>
                            <Button
                                type="button"
                                variant="contained"
                                color="inherit"
                                className="normal-case"
                                onClick={() => setOpenEditProfileDialog(true)}
                            >
                                <ModeEditOutlineIcon></ModeEditOutlineIcon>
                                <Typography className="text-sm font-semibold">
                                    Edit profile
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
                                    Posts
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
                                    Friends
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
                                    Photos
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
                                    Videos
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
                                    Check-ins
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
                                    More
                                </Typography>
                            </button>
                        </div>
                        <Button
                            type="button"
                            variant="contained"
                            color="inherit"
                        >
                            <MoreHorizIcon></MoreHorizIcon>
                        </Button>
                    </div>
                </div>
            </div>
            {openUpdateCoverDialog && (
                <UpdateCoverDialog
                    openUpdateCoverDialog={openUpdateCoverDialog}
                    setOpenUpdateCoverDialog={setOpenUpdateCoverDialog}
                ></UpdateCoverDialog>
            )}
            {openUpdateAvatarDialog && (
                <UpdateCoverDialog
                    openUpdateCoverDialog={openUpdateAvatarDialog}
                    setOpenUpdateCoverDialog={seOpenUpdateAvatarDialog}
                    type="avatar"
                ></UpdateCoverDialog>
            )}
            {openEditProfileDialog && (
                <EditProfileDialog
                    openEditProfileDialog={openEditProfileDialog}
                    setOpenEditProfileDialog={setOpenEditProfileDialog}
                ></EditProfileDialog>
            )}
        </>
    );
};

export default Header;
