"use client";

import { getAccessToken } from "@/utils/auth";
import { usePathname } from "next/navigation";

export default function Home() {
    const pathname = usePathname();
    console.log("Home ~ pathname:", pathname);
    const token = getAccessToken();
    console.log("Home ~ token:", token);
    return <div>Hello world</div>;
}
