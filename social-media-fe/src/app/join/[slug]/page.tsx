"use client";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import JoinGroupLinkDialog from "@/modules/conversation/modal/group/JoinGroupLinkDialog";
import {
    handleFindGroupByLink,
    handleGetListPendingMembers,
} from "@/services/conversation.service";
import { RootState } from "@/store/configureStore";
import { ConversationResponse, PendingUser } from "@/types/conversationType";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const JoinGroup = () => {
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    const [groupInfo, setGroupInfo] = useState<ConversationResponse>(
        {} as ConversationResponse
    );
    const [pendingUsers, setPendingUsers] = useState([] as PendingUser[]);
    const [loading, setLoading] = React.useState(false);
    const searchParams = useSearchParams();
    const groupId = searchParams.get("groupId");
    const [openJoinGroupLinkDialog, setOpenJoinGroupLinkDialog] =
        React.useState(false);
    useEffect(() => {
        async function findGroupByLink() {
            setLoading(true);
            const response = await handleFindGroupByLink(groupId ?? "");
            if (response) {
                const pendingResponse = await handleGetListPendingMembers(
                    response.conversation_id
                );
                if (pendingResponse) {
                    setPendingUsers(pendingResponse);
                    setGroupInfo(response);
                    setOpenJoinGroupLinkDialog(true);
                }
            }
            setLoading(false);
        }
        if (groupId) {
            findGroupByLink();
        }
    }, []);

    return (
        <>
            {loading && <LoadingSpinner></LoadingSpinner>}
            {!loading && openJoinGroupLinkDialog && (
                <JoinGroupLinkDialog
                    currentUserProfile={currentUserProfile}
                    pendingUsers={pendingUsers}
                    groupInfo={groupInfo}
                    openJoinGroupLinkDialog={openJoinGroupLinkDialog}
                    setOpenJoinGroupLinkDialog={setOpenJoinGroupLinkDialog}
                ></JoinGroupLinkDialog>
            )}
        </>
    );
};

export default JoinGroup;
