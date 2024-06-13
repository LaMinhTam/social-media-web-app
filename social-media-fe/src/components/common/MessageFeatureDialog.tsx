import { Button, Grid, Typography } from "@mui/material";
import React, { MutableRefObject } from "react";

const MessageFeatureDialog = () => {
    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className="w-[160px] py-2"
        >
            <Grid item className="flex-1 w-full">
                <Button
                    fullWidth
                    type="button"
                    color="inherit"
                    sx={{
                        textTransform: "none",
                    }}
                    className="px-2 py-3"
                >
                    <Typography className="text-[15px] font-medium">
                        Delete
                    </Typography>
                </Button>
            </Grid>
            <Grid item className="flex-1 w-full">
                <Button
                    fullWidth
                    type="button"
                    color="inherit"
                    sx={{
                        textTransform: "none",
                    }}
                    className="px-2 py-3"
                >
                    <Typography className="text-[15px] font-medium">
                        Forward
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    );
};

export default MessageFeatureDialog;
