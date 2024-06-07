import LayoutDashboard from "@/layout/LayoutDashboard";
import LayoutFriends from "@/layout/LayoutFriends";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";
import React from "react";

const FriendRequestPage = () => {
    return (
        <RequiredAuthLayout>
            <LayoutDashboard>
                <LayoutFriends>Lời mời kết bạn</LayoutFriends>
            </LayoutDashboard>
        </RequiredAuthLayout>
    );
};

export default FriendRequestPage;
