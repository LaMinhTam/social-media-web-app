import { SORT_STRATEGY } from "@/constants/global";
import {
    Box,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import React from "react";

const CommentSort = ({
    sortStrategy,
    handleSortChange,
}: {
    sortStrategy: string;
    handleSortChange: (event: SelectChangeEvent<string>) => void;
}) => {
    return (
        <Box
            sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Comments
            </Typography>
            <Select
                value={sortStrategy}
                onChange={handleSortChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
            >
                <MenuItem value={SORT_STRATEGY.NEWEST}>Newest</MenuItem>
                <MenuItem value={SORT_STRATEGY.OLDEST}>Oldest</MenuItem>
                <MenuItem value={SORT_STRATEGY.POPULAR}>Popular</MenuItem>
            </Select>
        </Box>
    );
};

export default CommentSort;
