import { handleKickMember } from "@/services/conversation.service";
import { Button, Grid } from "@mui/material";
import { PopupState } from "material-ui-popup-state/hooks";
import React from "react";

const GroupMemberAction = ({
    popupState,
    userRole,
    targetUserRole,
    userId,
    conversationId,
}: {
    popupState: PopupState;
    userRole: string;
    targetUserRole: string;
    userId: number;
    conversationId: string;
}) => {
    const onRemoveMember = async () => {
        const response = await handleKickMember(conversationId, userId);
        console.log("onRemoveMember ~ response:", response);
        if (response) {
            console.log("Member removed successfully");
            popupState.close();
        }
    };
    const onGrantAdmin = () => {
        console.log("Grant admin");
    };

    const onGrantDeputy = async () => {
        // const response = await handle
    };

    const onRemoveDeputy = () => {
        console.log("Remove deputy");
    };

    const onViewProfile = () => {
        console.log("View profile");
    };

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            flexDirection={"column"}
            className="w-full px-2 py-2"
        >
            {userRole === "ADMIN" && (
                <>
                    {targetUserRole !== "ADMIN" && (
                        <Grid item className="w-full">
                            <Button
                                type="button"
                                fullWidth
                                variant="text"
                                color="inherit"
                                className="normal-case"
                                onClick={onGrantAdmin}
                            >
                                Grant admin
                            </Button>
                        </Grid>
                    )}
                    {targetUserRole !== "DEPUTY" &&
                        targetUserRole !== "ADMIN" && (
                            <Grid item className="w-full">
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="text"
                                    color="inherit"
                                    className="normal-case"
                                    onClick={onGrantDeputy}
                                >
                                    Grant deputy
                                </Button>
                            </Grid>
                        )}
                    {targetUserRole === "DEPUTY" && (
                        <Grid item className="w-full">
                            <Button
                                type="button"
                                fullWidth
                                variant="text"
                                color="inherit"
                                className="normal-case"
                                onClick={onRemoveDeputy}
                            >
                                Remove deputy
                            </Button>
                        </Grid>
                    )}
                    {targetUserRole !== "ADMIN" && (
                        <Grid item className="w-full">
                            <Button
                                type="button"
                                fullWidth
                                variant="text"
                                color="inherit"
                                className="normal-case"
                                onClick={onRemoveMember}
                            >
                                Remove from group
                            </Button>
                        </Grid>
                    )}
                    <Grid item className="w-full">
                        <Button
                            type="button"
                            fullWidth
                            variant="text"
                            color="inherit"
                            className="normal-case"
                            onClick={onViewProfile}
                        >
                            View profile
                        </Button>
                    </Grid>
                </>
            )}
            {userRole === "DEPUTY" && (
                <>
                    {targetUserRole === "MEMBER" && (
                        <Grid item className="w-full">
                            <Button
                                type="button"
                                fullWidth
                                variant="text"
                                color="inherit"
                                className="normal-case"
                                onClick={onRemoveMember}
                            >
                                Remove from group
                            </Button>
                        </Grid>
                    )}
                    <Grid item className="w-full">
                        <Button
                            type="button"
                            fullWidth
                            variant="text"
                            color="inherit"
                            className="normal-case"
                            onClick={onViewProfile}
                        >
                            View profile
                        </Button>
                    </Grid>
                </>
            )}
            {userRole === "MEMBER" && (
                <Grid item className="w-full">
                    <Button
                        type="button"
                        fullWidth
                        variant="text"
                        color="inherit"
                        className="normal-case"
                        onClick={onViewProfile}
                    >
                        View profile
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};

export default GroupMemberAction;
