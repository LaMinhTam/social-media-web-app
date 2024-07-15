"use client";

import { SOCIAL_MEDIA_API } from "@/apis/constants";
import LayoutDashboard from "@/layout/LayoutDashboard";
import RequiredAuthLayout from "@/layout/RequiredAuthLayout";
import CreatePostDialog from "@/modules/posts/CreatePostDialog";
import Post from "@/modules/posts/Post";
import PostDialog from "@/modules/posts/PostDialog";
import PostHeader from "@/modules/posts/PostHeader";
import { handleGetNewFeed } from "@/services/post.service";
import { setPosts } from "@/store/actions/postSlice";
import { RootState } from "@/store/configureStore";
import { PostData } from "@/types/postType";
import reverseHashMap from "@/utils/posts/reverseHashMap";
import { Backdrop, CircularProgress, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
    const dispatch = useDispatch();
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

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const response = await handleGetNewFeed(1, 5);
            if (response) {
                dispatch(setPosts(response));
            }
            setLoading(false);
        }
        fetchData();
    }, [triggerFetchingPost]);

    return (
        <RequiredAuthLayout>
            <LayoutDashboard>
                <div className="w-full h-full bg-strock">
                    <div className="w-full h-full mt-[80px] max-w-[700px] mx-auto">
                        <PostHeader></PostHeader>
                        {loading ? (
                            <Backdrop
                                sx={{
                                    color: "#fff",
                                    zIndex: 50,
                                }}
                                open={loading}
                            >
                                <CircularProgress color="info" />
                            </Backdrop>
                        ) : (
                            <Grid container columnGap={20}>
                                {posts &&
                                    Object.keys(posts).length > 0 &&
                                    Object.values(posts)
                                        .reverse()
                                        .map((post: PostData) => (
                                            <Grid
                                                item
                                                key={post.post_id}
                                                className="w-full h-full"
                                            >
                                                <Post data={post}></Post>
                                            </Grid>
                                        ))}
                            </Grid>
                        )}
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
                </div>
            </LayoutDashboard>
        </RequiredAuthLayout>
    );
}
