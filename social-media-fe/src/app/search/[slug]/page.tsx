"use client";
import { SOCIAL_MEDIA_API } from "@/apis/constants";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import SearchPeopleCard from "@/modules/search/SearchPeopleCard";
import { Member } from "@/types/conversationType";
import { Box, Grid } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const SearchResult = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const q = searchParams.get("q");
    const [searchResult, setSearchResult] = React.useState<Member[]>([]);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        async function fetchSearchResult() {
            try {
                setLoading(true);
                const response = await SOCIAL_MEDIA_API.USER.findUserByName(
                    q ?? ""
                );
                if (response?.status === 200) {
                    setLoading(false);
                    setSearchResult(response.data);
                }
            } catch (error) {
                setLoading(false);
                console.error(error);
            }
        }
        if (q) fetchSearchResult();
    }, [q]);

    return (
        <Box className="md:p-8 mt-[80px]">
            <Box className="flex items-center justify-center">
                <Grid
                    container
                    className="flex flex-col items-center justify-center gap-y-4"
                >
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        searchResult.length > 0 &&
                        searchResult.map((user) => (
                            <Grid
                                item
                                key={user.user_id}
                                className="w-full max-w-[680px] h-full bg-lite rounded-lg"
                            >
                                <SearchPeopleCard
                                    user={user}
                                ></SearchPeopleCard>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default SearchResult;
