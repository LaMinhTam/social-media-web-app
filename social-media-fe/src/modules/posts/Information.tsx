import { Button, Typography } from "@mui/material";
import React from "react";

const Information = ({
    postReaction,
    handleCalculateTotalReaction,
    handleRenderReactionMessage,
    setOpenViewPostReactionDialog,
    onCommentClick,
}: {
    postReaction: { [key: string]: number };
    handleCalculateTotalReaction: number;
    handleRenderReactionMessage: (key: string) => string;
    setOpenViewPostReactionDialog: (value: boolean) => void;
    onCommentClick: () => void;
}) => {
    return (
        <div className="flex items-center justify-between mt-4">
            <Button
                type="button"
                variant="text"
                color="inherit"
                className="normal-case"
                size="large"
                onClick={() => setOpenViewPostReactionDialog(true)}
            >
                {postReaction &&
                    Object.keys(postReaction).length > 0 &&
                    Object.keys(postReaction).map((key, index) => {
                        return (
                            <Typography key={index} className="ml-2">
                                {handleRenderReactionMessage(key)}
                            </Typography>
                        );
                    })}
                <Typography className="ml-2">
                    {handleCalculateTotalReaction !== 0 &&
                        handleCalculateTotalReaction}
                </Typography>
            </Button>
            <Button
                type="button"
                variant="text"
                color="inherit"
                className="normal-case"
                onClick={onCommentClick}
            >
                <Typography>comments</Typography>
            </Button>
        </div>
    );
};

export default Information;
