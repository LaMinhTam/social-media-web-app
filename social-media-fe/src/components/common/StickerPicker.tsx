import React, { useCallback, useEffect } from "react";
import SearchInput from "./SearchInput";
import LoadingSpinner from "../loading/LoadingSpinner";
import { v4 as uuidv4 } from "uuid";
import { searchStickers } from "@/services/search.service";
import debounce from "lodash/debounce";
import { Grid } from "@mui/material";
import { Client } from "stompjs";
import { MESSAGE_TYPE } from "@/constants/global";
import { getAccessToken } from "@/utils/auth";
const StickerPicker = ({
    trendingData,
    conversationId,
    stompClient,
    setShowStickerPicker,
}: {
    trendingData: any;
    conversationId: string;
    stompClient: Client;
    setShowStickerPicker: (showStickerPicker: boolean) => void;
}) => {
    const [loading, setLoading] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [stickers, getStickers] = React.useState<any[]>([]);
    const accessToken = getAccessToken();

    const handleSendStickerMessage = (sticker: any) => {
        const chatMessage = {
            conversation_id: conversationId,
            content: sticker.images.fixed_height.url,
            type: MESSAGE_TYPE.STICKER,
        };
        setShowStickerPicker(false);
        stompClient.send(
            "/app/message",
            {
                Authorization: accessToken,
            },
            JSON.stringify(chatMessage)
        );
    };

    const stickerSearchDebounce = useCallback(
        debounce(async (searchTerm: string) => {
            setLoading(true);
            const data = await searchStickers(searchTerm, 100);
            if (data) {
                getStickers(data.data);
            }
            setLoading(false);
        }, 1000),
        []
    );

    useEffect(() => {
        if (searchTerm) {
            stickerSearchDebounce(searchTerm);
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
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className="w-full h-full max-h-[300px] overflow-y-auto"
            >
                {loading ? (
                    <LoadingSpinner></LoadingSpinner>
                ) : searchTerm.length > 0 ? (
                    stickers.length > 0 &&
                    stickers.map((sticker: any) => {
                        return (
                            <Grid
                                item
                                xs={3}
                                key={uuidv4()}
                                className="cursor-pointer"
                                onClick={() =>
                                    handleSendStickerMessage(sticker)
                                }
                            >
                                <img
                                    src={sticker.images.fixed_height.url}
                                    alt=""
                                    className="w-full h-auto"
                                ></img>
                            </Grid>
                        );
                    })
                ) : (
                    trendingData.length > 0 &&
                    trendingData.map((sticker: any) => {
                        return (
                            <Grid
                                item
                                xs={3}
                                key={uuidv4()}
                                className="cursor-pointer"
                                onClick={() =>
                                    handleSendStickerMessage(sticker)
                                }
                            >
                                <img
                                    src={sticker.images.fixed_height.url}
                                    alt=""
                                    className="w-full h-auto"
                                ></img>
                            </Grid>
                        );
                    })
                )}
            </Grid>
        </div>
    );
};

export default StickerPicker;
