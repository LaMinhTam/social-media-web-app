import DashboardTopBar from "@/modules/dashboard/DashboardTopBar";
import React from "react";

const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <DashboardTopBar></DashboardTopBar>
            {children}
        </>
    );
};

export default LayoutDashboard;
