"use client";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import JoinGroupLinkDialog from "@/modules/conversation/modal/group/JoinGroupLinkDialog";
import { handleFindGroupByLink } from "@/services/conversation.service";
import { ConversationResponse } from "@/types/conversationType";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const JoinGroup = () => {
    const [groupInfo, setGroupInfo] = useState<ConversationResponse>(
        {} as ConversationResponse
    );
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
                setGroupInfo(response);
                setOpenJoinGroupLinkDialog(true);
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
                    groupInfo={groupInfo}
                    openJoinGroupLinkDialog={openJoinGroupLinkDialog}
                    setOpenJoinGroupLinkDialog={setOpenJoinGroupLinkDialog}
                ></JoinGroupLinkDialog>
            )}
        </>
    );
};

export default JoinGroup;
