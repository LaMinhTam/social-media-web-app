import {
    handleApproveJoinGroupRequest,
    handleRejectJoinGroupRequest,
} from "@/services/conversation.service";
import { setListPendingUsers } from "@/store/actions/conversationSlice";
import { PendingUser } from "@/types/conversationType";
import { Button, Grid } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import { PopupState } from "material-ui-popup-state/hooks";
import React from "react";

const PendingUserAction = ({
    dispatch,
    listPendingUsers,
    popupState,
    userRole,
    userId,
    requestId,
    conversationId,
}: {
    dispatch: Dispatch<any>;
    listPendingUsers: PendingUser[];
    popupState: PopupState;
    userRole: string;
    userId: number;
    requestId: number;
    conversationId: string;
}) => {
    const onViewProfile = () => {
        console.log("View profile");
    };

    const onApprove = async () => {
        const response = await handleApproveJoinGroupRequest(
            conversationId,
            requestId,
            userId
        );
        const newListPendingUsers = listPendingUsers.filter(
            (user) => user.requester.user_id !== requestId
        );
        dispatch(setListPendingUsers(newListPendingUsers));
        popupState.close();
    };

    const onReject = async () => {
        const response = await handleRejectJoinGroupRequest(
            conversationId,
            requestId,
            userId
        );
        const newListPendingUsers = listPendingUsers.filter(
            (user) => user.requester.user_id !== requestId
        );
        dispatch(setListPendingUsers(newListPendingUsers));
        popupState.close();
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
                    <Grid item className="w-full">
                        <Button
                            type="button"
                            fullWidth
                            variant="text"
                            color="inherit"
                            className="normal-case"
                            onClick={onApprove}
                        >
                            Approve
                        </Button>
                    </Grid>
                    <Grid item className="w-full">
                        <Button
                            type="button"
                            fullWidth
                            variant="text"
                            color="inherit"
                            className="normal-case"
                            onClick={onReject}
                        >
                            Reject
                        </Button>
                    </Grid>
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

export default PendingUserAction;
