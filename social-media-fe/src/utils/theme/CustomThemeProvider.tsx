"use client";
import { ThemeProvider, createTheme } from "@mui/material";
import React from "react";

const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const theme = createTheme({
        palette: {
            mode: "light",
            primary: {
                main: "#556cd6",
            },
            secondary: {
                main: "#19857b",
            },
            error: {
                main: "#f44336",
            },
            background: {
                default: "#fff",
            },
            common: {
                white: "#ccc",
                black: "#24242C",
            },
        },
    });
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default CustomThemeProvider;
