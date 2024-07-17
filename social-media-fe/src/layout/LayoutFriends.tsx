import DashboardSidebar from "@/modules/dashboard/DashboardSidebar";
import React from "react";

const LayoutFriends = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="fixed left-0 top-[64px] z-40 bottom-0">
                <DashboardSidebar></DashboardSidebar>
            </div>
            <div className="w-full h-full bg-strock mt-[64px] pl-[360px] min-h-screen">
                {children}
            </div>
        </>
    );
};

export default LayoutFriends;
