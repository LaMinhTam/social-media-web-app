"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import DashboardSearch from "./DashboardSearch";
import useClickOutSide from "@/hooks/useClickOutSide";
import DashboardTab from "./DashboardTab";
import DashboardFeature from "./DashboardFeature";

export default function DashboardTopBar() {
    const {
        show: showSearch,
        setShow: setShowSearch,
        nodeRef: searchRef,
    } = useClickOutSide("button");

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" className="bg-lite text-text1">
                <Toolbar>
                    <DashboardSearch
                        showSearch={showSearch}
                        setShowSearch={setShowSearch}
                        searchRef={searchRef}
                    ></DashboardSearch>
                    <DashboardTab showSearch={showSearch}></DashboardTab>
                    <DashboardFeature></DashboardFeature>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
