import React, { useEffect } from "react";
import SearchInput from "./SearchInput";
import LoadingSpinner from "../loading/LoadingSpinner";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "@mui/material";
import { searchGIFs } from "@/services/search.service";
const GIFPicker = ({ trendingData }: { trendingData: any }) => {
    const [loading, setLoading] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [gifs, setGifs] = React.useState<any[]>([]);
    const gifSearchDebounce = debounce(async (searchTerm: string) => {
        setLoading(true);
        const response = await searchGIFs(searchTerm, 100);
        if (response?.status === 200) {
            setGifs(response.data);
            setLoading(false);
        }
    }, 500);

    useEffect(() => {
        if (searchTerm) {
            gifSearchDebounce(searchTerm);
        }
    }, [searchTerm]);

    return (
        <div className="w-[274px] h-full bg-lite shadow-md rounded-lg">
            <div className="w-full px-4 py-2">
                <SearchInput
                    placeholder="Search..."
                    inputProps={{
                        "aria-label": "Search...",
                    }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    className="w-full"
                ></SearchInput>
            </div>
            <div className="w-full h-full max-h-[300px] overflow-y-auto">
                <div className="flex flex-col items-start justify-center">
                    {loading ? (
                        <LoadingSpinner></LoadingSpinner>
                    ) : searchTerm.length > 0 ? (
                        gifs.length > 0 &&
                        gifs.map((gif: any) => {
                            return (
                                <div
                                    key={uuidv4()}
                                    className="w-full cursor-pointer"
                                >
                                    <img
                                        src={gif.images.fixed_height.url}
                                        alt=""
                                        className="w-full h-auto"
                                    ></img>
                                </div>
                            );
                        })
                    ) : (
                        trendingData.map((gif: any) => {
                            return (
                                <div
                                    key={uuidv4()}
                                    className="w-full cursor-pointer"
                                >
                                    <img
                                        src={gif.images.fixed_height.url}
                                        alt=""
                                        className="w-full h-auto"
                                    ></img>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default GIFPicker;
