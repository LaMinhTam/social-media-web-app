import LayoutDashboard from "@/layout/LayoutDashboard";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";
// import { useParams } from "next/navigation";
import React from "react";

const CallGroupLayout = ({ children }: { children: React.ReactNode }) => {
    // const params = useParams();
    return (
        <RequiredAuthLayout>
            <LayoutDashboard>{children}</LayoutDashboard>
        </RequiredAuthLayout>
    );
};

export default CallGroupLayout;
