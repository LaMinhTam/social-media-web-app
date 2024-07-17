"use client";
import { Box } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import ListFriend from "@/modules/friends/ListFriend";
const FriendRequestPage = () => {
    const router = useRouter();
    const relationshipUsers = useSelector(
        (state: RootState) => state.user.relationshipUsers
    );
    return (
        <Box className="p-5">
            <ListFriend
                router={router}
                data={relationshipUsers.receive_request}
                type="receive"
            ></ListFriend>
        </Box>
    );
};

export default FriendRequestPage;
