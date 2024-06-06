import DashboardTopBar from "@/modules/dashboard/DashboardTopBar";
import React from "react";

const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <DashboardTopBar></DashboardTopBar>
            {children}
        </div>
    );
};

export default LayoutDashboard;
