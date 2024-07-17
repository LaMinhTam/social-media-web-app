"use client";
import LayoutDashboard from "@/layout/LayoutDashboard";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";
import { Box, CircularProgress, Grid } from "@mui/material";
import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import Header from "@/modules/profile/Header";
import PostHeader from "@/modules/posts/PostHeader";
import PostFilter from "@/modules/posts/PostFilter";
import ListImage from "@/modules/profile/ListImage";
import ListFriend from "@/modules/profile/ListFriend";
import ProfileInfo from "@/modules/profile/ProfileInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import PostDialog from "@/modules/posts/PostDialog";
import CreatePostDialog from "@/modules/posts/CreatePostDialog";
import { handleGetUserWall } from "@/services/post.service";
import PostResponse, { PostData } from "@/types/postType";
import Post from "@/modules/posts/Post";
import SharePostDialog from "@/modules/posts/share/SharePostDialog";

const Profile = () => {
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const [userPosts, setUserPosts] = React.useState<PostResponse>(
        {} as PostResponse
    );
    const openSharePostDialog = useSelector(
        (state: RootState) => state.post.openSharePostDialog
    );
    const openCreatePostDialog = useSelector(
        (state: RootState) => state.post.openCreatePostDialog
    );
    const openPostDialog = useSelector(
        (state: RootState) => state.post.openPostDialog
    );
    const currentPostData = useSelector(
        (state: RootState) => state.post.currentPostData
    );
    const [postLoading, setPostLoading] = React.useState(false);
    const [page, setPage] = React.useState<number>(1);
    const [isEndedList, setIsEndedList] = React.useState<boolean>(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const endRef = useRef<HTMLDivElement>(null);

    const fetchData = useCallback(async () => {
        setPostLoading(true);
        const response = await handleGetUserWall(
            currentUserProfile.user_id,
            page,
            5
        );
        if (response) {
            const newPosts = {
                ...userPosts,
                ...response,
            };
            setUserPosts(newPosts);
            if (Object.keys(response).length === 0) {
                setIsEndedList(true);
            }
        } else {
            setIsEndedList(true);
            setPostLoading(false);
            return;
        }
        setPostLoading(false);
    }, [page]);

    useEffect(() => {
        fetchData();
    }, [page, fetchData]);

    useLayoutEffect(() => {
        if (postLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isEndedList) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 0.1 }
        );
        if (endRef.current) observer.current.observe(endRef.current);

        return () => observer.current?.disconnect();
    }, [postLoading, isEndedList]);
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
                                    <Grid container columnGap={20}>
                                        {userPosts &&
                                            Object.keys(userPosts).length > 0 &&
                                            Object.values(userPosts).map(
                                                (post: PostData) => (
                                                    <Grid
                                                        item
                                                        key={post.post_id}
                                                        className="w-full h-full"
                                                    >
                                                        <Post
                                                            data={post}
                                                        ></Post>
                                                    </Grid>
                                                )
                                            )}
                                    </Grid>
                                    {postLoading && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                mt: 2,
                                            }}
                                        >
                                            <CircularProgress />
                                        </Box>
                                    )}
                                    <div ref={endRef} style={{ height: 20 }} />
                                    {openCreatePostDialog && (
                                        <CreatePostDialog
                                            openCreatePostDialog={
                                                openCreatePostDialog
                                            }
                                        ></CreatePostDialog>
                                    )}

                                    {currentPostData && openPostDialog && (
                                        <PostDialog
                                            post={currentPostData}
                                            openPostDialog={openPostDialog}
                                        ></PostDialog>
                                    )}
                                    {openSharePostDialog && (
                                        <SharePostDialog
                                            openSharePostDialog={
                                                openSharePostDialog
                                            }
                                        ></SharePostDialog>
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
