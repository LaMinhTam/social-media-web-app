"use client";
import LayoutDashboard from "@/layout/LayoutDashboard";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";
import { Grid } from "@mui/material";
import React from "react";
import Header from "@/modules/profile/Header";
import Post from "@/modules/posts/Post";
import PostHeader from "@/modules/posts/PostHeader";
import PostFilter from "@/modules/posts/PostFilter";
import ListImage from "@/modules/profile/ListImage";
import ListFriend from "@/modules/profile/ListFriend";
import ProfileInfo from "@/modules/profile/ProfileInfo";

const Profile = () => {
    return (
        <RequiredAuthLayout>
            <LayoutDashboard>
                <div className="w-full h-full bg-strock">
                    <Header></Header>
                    <div className="w-full max-w-[1048px] h-full px-4 mx-auto mt-4 flex">
                        <Grid container spacing={3} style={{ height: "100%" }}>
                            <Grid
                                item
                                md={5}
                                xs={12}
                                style={{ height: "100%", overflowY: "auto" }}
                            >
                                <ProfileInfo></ProfileInfo>
                                <ListImage></ListImage>
                                <ListFriend></ListFriend>
                            </Grid>
                            <Grid
                                item
                                md={7}
                                xs={12}
                                style={{ height: "100%", overflowY: "auto" }}
                            >
                                <PostHeader></PostHeader>
                                <PostFilter></PostFilter>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Post key={index}></Post>
                                ))}
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </LayoutDashboard>
        </RequiredAuthLayout>
    );
};

export default Profile;
