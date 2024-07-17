import { formatOnlineTime } from "@/utils/conversation/messages/handleGroupMessage";
import { Button, Tooltip, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Image from "next/image";
import React from "react";
import handleFormatPostTime from "@/utils/posts/handleFormatPostTime";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import { DEFAULT_AVATAR } from "@/constants/global";

const Header = ({
    authors,
    create_at,
}: {
    authors: { name: string; id: number }[];
    create_at: number;
}) => {
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );

    const router = useRouter();

    const handleAuthorClick = (authorId: number) => {
        let route = "";
        if (authorId === currentUserProfile?.user_id) {
            route = "/me";
        } else {
            route = `/user/${authorId}`;
        }
        router.push(route);
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <Image
                    src={DEFAULT_AVATAR}
                    width={40}
                    height={40}
                    className="object-cover w-10 h-10 rounded-full cursor-pointer"
                    alt="profile"
                    onClick={() => handleAuthorClick(authors[0].id)} // Default to the first author
                ></Image>
                <Tooltip title={handleFormatPostTime(create_at)}>
                    <div>
                        {authors.map((author, index) => (
                            <Typography
                                key={index}
                                className="font-semibold cursor-pointer"
                                onClick={() => handleAuthorClick(author.id)}
                            >
                                {author.name}
                            </Typography>
                        ))}
                        <Typography className="text-sm">
                            {formatOnlineTime(create_at)}
                        </Typography>
                    </div>
                </Tooltip>
            </div>
            <Button type="button" variant="text" color="info">
                <MoreHorizIcon></MoreHorizIcon>
            </Button>
        </div>
    );
};

export default Header;
