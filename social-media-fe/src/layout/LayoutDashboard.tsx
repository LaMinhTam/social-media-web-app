"use client";
import { SOCIAL_MEDIA_API } from "@/apis/constants";
import DashboardTopBar from "@/modules/dashboard/DashboardTopBar";
import { setRelationshipUsers } from "@/store/actions/userSlice";
import { RootState } from "@/store/configureStore";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();
    const triggerReFetchingRelationship = useSelector(
        (state: RootState) => state.common.triggerReFetchingRelationship
    );
    useEffect(() => {
        async function fetchRelationshipUsers() {
            try {
                const response =
                    await SOCIAL_MEDIA_API.USER.getCurrentUserFriends();
                if (response?.status === 200) {
                    dispatch(setRelationshipUsers(response.data));
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchRelationshipUsers();
    }, [triggerReFetchingRelationship]);

    return (
        <>
            <DashboardTopBar></DashboardTopBar>
            {children}
        </>
    );
};

export default LayoutDashboard;
