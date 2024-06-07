import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Image from "next/image";

export default function UserCard() {
    return (
        <Card sx={{ maxWidth: 250 }}>
            <CardMedia
                component="img"
                alt="green iguana"
                width="100%"
                height="222"
                image="https://source.unsplash.com/random"
                className="object-cover w-full h-[222px] rounded"
            />
            <CardContent>
                <Typography variant="h6" className="text-lg font-semibold">
                    Thong Dinh
                </Typography>
                <Box className="flex items-center justify-start gap-x-2">
                    <Box className="flex items-center justify-start">
                        {Array.from(Array(2)).map((_, index) => (
                            <Image
                                key={index}
                                src="https://source.unsplash.com/random"
                                width={16}
                                height={16}
                                alt="avatar"
                                className="w-4 h-4 -mr-1 border-2 border-white rounded-full"
                            />
                        ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        2 bạn chung
                    </Typography>
                </Box>
            </CardContent>
            <CardActions className="flex flex-col gap-y-3">
                <Button
                    size="medium"
                    type="button"
                    color="info"
                    variant="contained"
                    fullWidth
                >
                    Xác nhận
                </Button>
                <Button
                    size="medium"
                    type="button"
                    color="inherit"
                    variant="contained"
                    fullWidth
                >
                    Xóa
                </Button>
            </CardActions>
        </Card>
    );
}
