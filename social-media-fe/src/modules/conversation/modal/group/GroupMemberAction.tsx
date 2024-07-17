import {
    handleGrantDeputy,
    handleKickMember,
    handleRevokeDeputy,
    handleTransferOwner,
} from "@/services/conversation.service";
import { GroupSettings } from "@/types/conversationType";
import { Button, Grid } from "@mui/material";
import { PopupState } from "material-ui-popup-state/hooks";
import { useRouter } from "next/navigation";
import React from "react";

const GroupMemberAction = ({
    settings,
    popupState,
    userRole,
    targetUserRole,
    userId,
    conversationId,
}: {
    settings: GroupSettings;
    popupState: PopupState;
    userRole: string;
    targetUserRole: string;
    userId: number;
    conversationId: string;
}) => {
    const router = useRouter();
    const onRemoveMember = async () => {
        const response = await handleKickMember(conversationId, userId);
        if (response) {
            console.log("Member removed successfully");
            popupState.close();
        }
    };
    const onGrantAdmin = async () => {
        const response = await handleTransferOwner(conversationId, userId);
        if (response) {
            console.log("Admin granted successfully");
            popupState.close();
        }
    };

    const onGrantDeputy = async () => {
        const response = await handleGrantDeputy(conversationId, userId);
        if (response) {
            console.log("Deputy granted successfully");
            popupState.close();
        }
    };

    const onRemoveDeputy = async () => {
        const response = await handleRevokeDeputy(conversationId, userId);
        if (response) {
            console.log("Deputy removed successfully");
            popupState.close();
        }
    };

    const onViewProfile = () => {
        popupState.close();
        router.push(`/user/${userId}`);
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
                        <>
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
                            {settings.allow_deputy_promote_member && (
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
                        </>
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
