import LayoutDashboard from "@/layout/LayoutDashboard";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <RequiredAuthLayout>
            <LayoutDashboard>{children}</LayoutDashboard>
        </RequiredAuthLayout>
    );
};

export default layout;
