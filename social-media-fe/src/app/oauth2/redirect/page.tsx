"use client";
import { saveRefreshToken } from "@/utils/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const OAuth2RedirectHandler = () => {
    const router = useRouter();
    const token = useSearchParams().get("token")?.split("#_=_")[0];
    const error = useSearchParams().get("error");

    useEffect(() => {
        if (!error && token) {
            saveRefreshToken(token);
            toast.success("You're successfully logged in!");
            router.push("/");
        } else {
            router.push("/signin");
            toast.error(
                "There was an error processing your request, please try again."
            );
            console.error("Error: ", error);
        }
    }, [token, error]);

    return <div>OAuth2</div>;
};

export default OAuth2RedirectHandler;
