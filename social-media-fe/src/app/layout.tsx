import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.scss";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import CustomThemeProvider from "@/utils/theme/CustomThemeProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import StoreProvider from "@/utils/providers/StoreProvider";

const manrope = Manrope({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Social Media App",
    description: "Social Media App built with Next.js and TypeScript",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={manrope.className}>
                <StoreProvider>
                    <CustomThemeProvider>
                        <ReactQueryProvider>{children}</ReactQueryProvider>
                    </CustomThemeProvider>
                    <ToastContainer bodyClassName="font-primary text-sm"></ToastContainer>
                </StoreProvider>
            </body>
        </html>
    );
}
