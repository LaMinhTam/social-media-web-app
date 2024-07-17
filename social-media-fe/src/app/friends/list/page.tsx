"use client";
import { Box } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import ListFriend from "@/modules/friends/ListFriend";
const ListFriendPage = () => {
    const router = useRouter();
    const relationshipUsers = useSelector(
        (state: RootState) => state.user.relationshipUsers
    );
    return (
        <Box className="p-5">
            <ListFriend
                router={router}
                data={relationshipUsers.friends}
                type="friend"
            ></ListFriend>
        </Box>
    );
};

export default ListFriendPage;
