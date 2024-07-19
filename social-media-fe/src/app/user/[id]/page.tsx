"use client";
import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation"; // Import the necessary hooks
import {
    Backdrop,
    Box,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";
import ProfileInfo from "@/modules/profile/ProfileInfo";
import ListImage from "@/modules/profile/ListImage";
import ListFriend from "@/modules/profile/ListFriend";
import { findUserById } from "@/services/search.service";
import Header from "@/modules/profile/Header";
import { Member } from "@/types/conversationType";
import Post from "@/modules/posts/Post";
import { handleGetNewFeed, handleGetUserWall } from "@/services/post.service";
import PostResponse, { PostData } from "@/types/postType";
import CreatePostDialog from "@/modules/posts/CreatePostDialog";
import PostDialog from "@/modules/posts/PostDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import SharePostDialog from "@/modules/posts/share/SharePostDialog";

const UserProfilePage = () => {
    const isMobile = useSelector((state: RootState) => state.common.isMobile);
    const pathname = usePathname();
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
    const id = pathname.split("/").pop();
    const [userProfile, setUserProfile] = React.useState<Member>({} as Member);
    const [userPosts, setUserPosts] = React.useState<PostResponse>(
        {} as PostResponse
    );
    const [loading, setLoading] = React.useState(true);
    const [postLoading, setPostLoading] = React.useState(false);
    const [page, setPage] = React.useState<number>(1);
    const [isEndedList, setIsEndedList] = React.useState<boolean>(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const endRef = useRef<HTMLDivElement>(null);

    const fetchData = useCallback(async () => {
        setPostLoading(true);
        const response = await handleGetUserWall(Number(id), page, 5);
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

    useEffect(() => {
        async function fetchUserData() {
            setLoading(true);
            const response = await findUserById(id ?? "");
            if (response) {
                setUserProfile(response);
            }
            setLoading(false);
        }
        fetchUserData();
    }, [id]);

    return (
        <div className="w-full h-full overflow-x-hidden overflow-y-auto bg-strock custom-scrollbar">
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
                <>
                    <Header data={userProfile} type="user"></Header>
                    <div className="w-full max-w-[1048px] h-full md:px-4 mx-auto md:mt-4">
                        <Grid
                            container
                            direction={isMobile ? "column" : "row"}
                            spacing={isMobile ? 0 : 3}
                        >
                            <Grid item md={5} xs={12}>
                                {!isMobile && (
                                    <>
                                        <ProfileInfo></ProfileInfo>
                                        <ListImage></ListImage>
                                    </>
                                )}
                                <ListFriend type="user"></ListFriend>
                            </Grid>
                            <Grid item md={7} xs={12} className="flex flex-col">
                                <div className="flex-1 overflow-x-hidden overflow-y-auto md:basis-0 grow">
                                    <Grid container columnGap={20}>
                                        {!postLoading &&
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
                                        {!postLoading &&
                                            Object.keys(userPosts).length ===
                                                0 && (
                                                <Grid
                                                    item
                                                    className="w-full h-full"
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                            height: "100%",
                                                            mt: 2,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="h5"
                                                            className="font-semibold"
                                                        >
                                                            No post
                                                        </Typography>
                                                    </Box>
                                                </Grid>
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
                </>
            )}
        </div>
    );
};

export default UserProfilePage;
