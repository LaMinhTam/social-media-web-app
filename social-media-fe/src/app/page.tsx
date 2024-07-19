"use client";

import { SOCIAL_MEDIA_API } from "@/apis/constants";
import LayoutDashboard from "@/layout/LayoutDashboard";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";
import CreatePostDialog from "@/modules/posts/CreatePostDialog";
import Post from "@/modules/posts/Post";
import PostDialog from "@/modules/posts/PostDialog";
import PostHeader from "@/modules/posts/PostHeader";
import SharePostDialog from "@/modules/posts/share/SharePostDialog";
import { handleGetNewFeed } from "@/services/post.service";
import { setPage, setPosts } from "@/store/actions/postSlice";
import { RootState } from "@/store/configureStore";
import { PostData } from "@/types/postType";
import { Backdrop, Box, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
    const dispatch = useDispatch();
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
    const triggerFetchingPost = useSelector(
        (state: RootState) => state.post.triggerFetchingPost
    );
    const posts = useSelector((state: RootState) => state.post.posts);
    const [loading, setLoading] = React.useState<boolean>(false);
    const page = useSelector((state: RootState) => state.post.page);
    const [isEndedList, setIsEndedList] = React.useState<boolean>(false);
    const homeRef = useRef<HTMLDivElement>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const endRef = useRef<HTMLDivElement>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const response = await handleGetNewFeed(page, 5);
        if (response) {
            const newPosts = {
                ...posts,
                ...response,
            };
            dispatch(setPosts(newPosts));
            if (Object.keys(response).length === 0) {
                setIsEndedList(true);
            }
        } else {
            setIsEndedList(true);
            setLoading(false);
            return;
        }
        setLoading(false);
    }, [dispatch, page]);

    useEffect(() => {
        fetchData();
    }, [triggerFetchingPost, page, fetchData]);

    useLayoutEffect(() => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isEndedList) {
                    dispatch(setPage(page + 1));
                }
            },
            { threshold: 0.1 }
        );
        if (endRef.current) observer.current.observe(endRef.current);

        return () => observer.current?.disconnect();
    }, [loading, isEndedList]);

    return (
        <RequiredAuthLayout>
            <LayoutDashboard>
                <div className="w-full h-full bg-strock" ref={homeRef}>
                    <div className="w-full h-full mt-[80px] max-w-[700px] mx-auto">
                        <PostHeader></PostHeader>
                        <Grid container columnGap={20}>
                            {posts &&
                                Object.keys(posts).length > 0 &&
                                Object.values(posts).map((post: PostData) => (
                                    <Grid
                                        item
                                        key={post.post_id}
                                        className="w-full h-full"
                                    >
                                        <Post data={post}></Post>
                                    </Grid>
                                ))}
                        </Grid>
                        {loading && (
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
                    </div>
                    {openCreatePostDialog && (
                        <CreatePostDialog
                            openCreatePostDialog={openCreatePostDialog}
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
                            openSharePostDialog={openSharePostDialog}
                        ></SharePostDialog>
                    )}
                </div>
            </LayoutDashboard>
        </RequiredAuthLayout>
    );
}
