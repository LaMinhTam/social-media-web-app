import { Box } from "@mui/material";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import { usePathname, useRouter } from "next/navigation";

const DashboardTab = ({ showSearch }: { showSearch: boolean }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [currentTab, setCurrentTab] = React.useState(pathname);
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: showSearch ? "320px" : 0,
            }}
            className="hidden md:flex"
        >
            <button
                className={`flex items-center justify-center w-[112px] h-[56px] 
        flex-shrink-0 hover:text-secondary ${
            currentTab === "/" ? "border-b-4 border-secondary" : ""
        }`}
                onClick={() => router.push("/")}
            >
                <HomeIcon
                    className={`w-8 h-8 ${
                        currentTab === "/" ? "text-secondary" : ""
                    }`}
                />
            </button>
            <button
                className={`flex items-center justify-center w-[112px] h-[56px] 
        flex-shrink-0 hover:text-secondary ${
            currentTab.includes("/friends") ? "border-b-4 border-secondary" : ""
        }`}
                onClick={() => router.push("/friends")}
            >
                <PeopleOutlineRoundedIcon
                    className={`w-8 h-8 ${
                        currentTab.includes("/friends") ? "text-secondary" : ""
                    }`}
                />
            </button>
        </Box>
    );
};

export default DashboardTab;
