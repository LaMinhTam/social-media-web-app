"use client";
import { saveAccessToken } from "@/utils/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const OAuth2RedirectHandler = () => {
    const router = useRouter();
    const token = useSearchParams().get("token")?.split("#_=_")[0];
    const error = useSearchParams().get("error");

    useEffect(() => {
        if (!error && token) {
            saveAccessToken(token);
            router.push("/");
        } else {
            router.push("/signin");
            console.error("Error: ", error);
        }
    }, [token, error]);

    return <div>OAuth2</div>;
};

export default OAuth2RedirectHandler;
