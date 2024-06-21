"use client";
import LayoutDashboard from "@/layout/LayoutDashboard";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";
import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import Header from "@/modules/profile/Header";
import Post from "@/modules/posts/Post";
import PostHeader from "@/modules/posts/PostHeader";
import PostFilter from "@/modules/posts/PostFilter";
import ListImage from "@/modules/profile/ListImage";
import ListFriend from "@/modules/profile/ListFriend";
import ProfileInfo from "@/modules/profile/ProfileInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";

const Profile = () => {
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    return (
        <RequiredAuthLayout>
            <LayoutDashboard>
                <div className="w-full h-full overflow-y-auto bg-strock custom-scrollbar">
                    <Header data={currentUserProfile}></Header>
                    <div className="w-full max-w-[1048px] h-full px-4 mx-auto mt-4 flex">
                        <Grid container spacing={3}>
                            <Grid item md={5} xs={12}>
                                <ProfileInfo></ProfileInfo>
                                <ListImage></ListImage>
                                <ListFriend></ListFriend>
                            </Grid>
                            <Grid item md={7} xs={12} className="flex flex-col">
                                <div className="overflow-x-hidden overflow-y-auto basis-0 grow">
                                    <PostHeader></PostHeader>
                                    <PostFilter></PostFilter>
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <Post key={index}></Post>
                                        )
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </LayoutDashboard>
        </RequiredAuthLayout>
    );
};

export default Profile;
