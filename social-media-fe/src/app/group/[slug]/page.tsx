"use client";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import GroupCallDialog from "@/modules/conversation/modal/call/GroupCallDialog";
import { handleGetConversationDetails } from "@/services/conversation.service";
import { setOpenGroupCallDialog } from "@/store/actions/commonSlice";
import { RootState } from "@/store/configureStore";
import { ConversationResponse } from "@/types/conversationType";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const VideoCallGroup = () => {
    const dispatch = useDispatch();
    const [groupInfo, setGroupInfo] = useState<ConversationResponse>(
        {} as ConversationResponse
    );
    const [loading, setLoading] = React.useState(false);
    const openGroupCallDialog = useSelector(
        (state: RootState) => state.common.openGroupCallDialog
    );
    const searchParams = useSearchParams();
    const groupId = searchParams.get("groupId");
    const currentUserProfile = useSelector(
        (state: RootState) => state.profile.currentUserProfile
    );
    useEffect(() => {
        async function findConversationById() {
            setLoading(true);
            const response = await handleGetConversationDetails(groupId ?? "");
            if (response) {
                Swal.fire({
                    title: `Join ${response.name} group call?`,
                    text: "Do you want to join this group call?",
                    imageUrl: response.image,
                    imageWidth: 400,
                    imageHeight: 200,
                    imageAlt: "Custom image",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, join it!",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setGroupInfo(response);
                        dispatch(setOpenGroupCallDialog(true));
                    }
                });
            }
            setLoading(false);
        }
        if (groupId) {
            findConversationById();
        }
    }, []);
    return (
        <>
            {loading && <LoadingSpinner></LoadingSpinner>}
            {!loading && openGroupCallDialog && (
                <GroupCallDialog
                    name={currentUserProfile.name || "Unknown"}
                    dispatch={dispatch}
                    conversation={groupInfo}
                    openGroupCallDialog={openGroupCallDialog}
                ></GroupCallDialog>
            )}
            <span className="mt-[100px]">Hello world</span>
        </>
    );
};

export default VideoCallGroup;
