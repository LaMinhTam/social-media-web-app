import { Grid } from "@mui/material";
import Image from "next/image";
import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

const Media = ({ media }: { media: string[] }) => {
    return (
        <div className="mt-4">
            <PhotoProvider>
                <Grid container>
                    {media.slice(0, 4).map((item, index) => (
                        <Grid
                            item
                            key={index}
                            xs={media.length === 1 ? 12 : 6}
                            className="w-full h-[250px] relative cursor-pointer"
                        >
                            <PhotoView src={item}>
                                <Image
                                    src={item}
                                    layout="fill"
                                    sizes="100%"
                                    style={{
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    alt="image"
                                />
                            </PhotoView>
                            {index === 3 && media.length > 4 && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50"
                                    style={{ pointerEvents: "none" }}
                                >
                                    <span className="text-3xl font-bold text-lite">
                                        + {media.length - 4}
                                    </span>
                                </div>
                            )}
                        </Grid>
                    ))}
                </Grid>
            </PhotoProvider>
        </div>
    );
};

export default Media;
