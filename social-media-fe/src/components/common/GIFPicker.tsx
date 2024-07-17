import React, { useCallback, useEffect } from "react";
import SearchInput from "./SearchInput";
import LoadingSpinner from "../loading/LoadingSpinner";
import { v4 as uuidv4 } from "uuid";
import { searchGIFs } from "@/services/search.service";
import debounce from "lodash/debounce";
import { MESSAGE_TYPE } from "@/constants/global";
import { Client } from "stompjs";
import { getAccessToken } from "@/utils/auth";
const GIFPicker = ({
    trendingData,
    conversationId,
    stompClient,
    setShowGIFPicker,
}: {
    trendingData: any;
    conversationId: string;
    stompClient: Client;
    setShowGIFPicker: (showGIFPicker: boolean) => void;
}) => {
    const [loading, setLoading] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [gifs, setGifs] = React.useState<any[]>([]);
    const accessToken = getAccessToken();

    const handleSendGIFMessage = (gif: any) => {
        const chatMessage = {
            conversation_id: conversationId,
            content: gif.images.fixed_height.url,
            type: MESSAGE_TYPE.GIF,
        };
        setShowGIFPicker(false);
        stompClient.send(
            "/app/message",
            {
                Authorization: accessToken,
            },
            JSON.stringify(chatMessage)
        );
    };

    const gifSearchDebounce = useCallback(
        debounce(async (searchTerm: string) => {
            setLoading(true);
            const data = await searchGIFs(searchTerm, 100);
            if (data) {
                setGifs(data.data);
            }
            setLoading(false);
        }, 1000),
        []
    );

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
                <div className="flex flex-col items-center justify-center">
                    {loading ? (
                        <LoadingSpinner></LoadingSpinner>
                    ) : searchTerm.length > 0 ? (
                        gifs.length > 0 &&
                        gifs.map((gif: any) => {
                            return (
                                <div
                                    key={uuidv4()}
                                    className="w-full cursor-pointer"
                                    onClick={() => handleSendGIFMessage(gif)}
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
                                    onClick={() => handleSendGIFMessage(gif)}
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
