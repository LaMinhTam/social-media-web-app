"use client";

import LayoutDashboard from "@/layout/LayoutDashboard";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";

export default function Home() {
    return (
        <RequiredAuthLayout>
            <LayoutDashboard>
                <span></span>
            </LayoutDashboard>
        </RequiredAuthLayout>
    );
}
