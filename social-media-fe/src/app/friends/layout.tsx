import LayoutDashboard from "@/layout/LayoutDashboard";
import LayoutFriends from "@/layout/LayoutFriends";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";
import React from "react";

const FriendLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <RequiredAuthLayout>
            <LayoutDashboard>
                <LayoutFriends>{children}</LayoutFriends>
            </LayoutDashboard>
        </RequiredAuthLayout>
    );
};

export default FriendLayout;
