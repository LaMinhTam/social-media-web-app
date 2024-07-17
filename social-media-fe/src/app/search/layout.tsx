"use client";
import LayoutDashboard from "@/layout/LayoutDashboard";
import LayoutSidebar from "@/layout/LayoutSidebar";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";
import SearchSession from "@/modules/search/SearchSession";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

const SearchResultPage = ({ children }: { children: React.ReactNode }) => {
    const searchParams = useSearchParams();
    const q = searchParams.get("q");
    const pathname = usePathname();
    return (
        <RequiredAuthLayout>
            <LayoutDashboard>
                <div className="fixed left-0 top-[64px] z-40 bottom-0">
                    <LayoutSidebar title="Search result" type="search">
                        <SearchSession
                            query={q ?? ""}
                            pathname={pathname}
                        ></SearchSession>
                    </LayoutSidebar>
                </div>
                <div className="w-full h-full bg-strock mt-[64px] pl-[360px] min-h-screen">
                    {children}
                </div>
            </LayoutDashboard>
        </RequiredAuthLayout>
    );
};

export default SearchResultPage;
