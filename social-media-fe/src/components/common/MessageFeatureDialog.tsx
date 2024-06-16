import { Button, Grid, Typography } from "@mui/material";
import React from "react";

const MessageFeatureDialog = ({
    setOpenDeleteDialog,
    setOpenForwardDialog,
}: {
    setOpenDeleteDialog: (open: boolean) => void;
    setOpenForwardDialog: (open: boolean) => void;
}) => {
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
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenDeleteDialog(true);
                    }}
                    className="px-2 py-3 btnRemoveMessage"
                >
                    <Typography className="text-[15px] font-medium">
                        Remove
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
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenForwardDialog(true);
                    }}
                >
                    <Typography className="text-[15px] font-medium btnForwardMessage">
                        Forward
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    );
};

export default MessageFeatureDialog;
