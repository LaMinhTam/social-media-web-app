import { formatOnlineTime } from "@/utils/conversation/messages/handleGroupMessage";
import { Button, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Image from "next/image";
import React from "react";

const Header = ({
    authors,
    create_at,
}: {
    authors: string;
    create_at: number;
}) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <Image
                    src={`https://source.unsplash.com/random`}
                    width={40}
                    height={40}
                    className="object-cover w-10 h-10 rounded-full"
                    alt="profile"
                ></Image>
                <div>
                    <Typography className="font-semibold">{authors}</Typography>
                    <Typography className="text-sm">
                        {formatOnlineTime(create_at)} ago
                    </Typography>
                </div>
            </div>
            <Button type="button" variant="text" color="info">
                <MoreHorizIcon></MoreHorizIcon>
            </Button>
        </div>
    );
};

export default Header;
