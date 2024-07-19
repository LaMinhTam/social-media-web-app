"use client";
import DashboardSidebar from "@/modules/dashboard/DashboardSidebar";
import { RootState } from "@/store/configureStore";
import React from "react";
import { useSelector } from "react-redux";

const LayoutFriends = ({ children }: { children: React.ReactNode }) => {
    const isMobile = useSelector((state: RootState) => state.common.isMobile);
    return (
        <>
            {!isMobile ? (
                <>
                    <div className="fixed left-0 top-[64px] z-40 bottom-0">
                        <DashboardSidebar></DashboardSidebar>
                    </div>
                    <div className="w-full h-full bg-strock mt-[64px] pl-[360px] min-h-screen">
                        {children}
                    </div>
                </>
            ) : (
                <div>{children}</div>
            )}
        </>
    );
};

export default LayoutFriends;
